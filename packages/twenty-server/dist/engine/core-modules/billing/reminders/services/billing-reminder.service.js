/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingReminderService", {
    enumerable: true,
    get: function() {
        return BillingReminderService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _datefns = require("date-fns");
const _twentyemails = require("twenty-emails");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _billingsubscriptionentity = require("../../entities/billing-subscription.entity");
const _billingsubscriptionintervalenum = require("../../enums/billing-subscription-interval.enum");
const _billingsubscriptionstatusenum = require("../../enums/billing-subscription-status.enum");
const _billingremindersentkeysconstant = require("../constants/billing-reminder-sent-keys.constant");
const _workspacedomainsservice = require("../../../domain/workspace-domains/services/workspace-domains.service");
const _emailservice = require("../../../email/email.service");
const _i18nservice = require("../../../i18n/i18n.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _uservarsservice = require("../../../user/user-vars/services/user-vars.service");
const _userservice = require("../../../user/services/user.service");
const _workspaceentity = require("../../../workspace/workspace.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BillingReminderService = class BillingReminderService {
    async processReminders() {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        const now = new Date();
        await this.processTrialReminders(now);
        await this.processRenewalReminders(now);
    }
    async processTrialReminders(now) {
        const withoutCardDaysBefore = this.twentyConfigService.get('BILLING_TRIAL_WITHOUT_CREDIT_CARD_REMINDER_DAYS_BEFORE');
        const withCardDaysBefore = this.twentyConfigService.get('BILLING_TRIAL_WITH_CREDIT_CARD_REMINDER_DAYS_BEFORE');
        const windowEnd = (0, _datefns.addDays)(now, Math.max(withoutCardDaysBefore, withCardDaysBefore) + 1);
        const trialingSubscriptions = await this.billingSubscriptionRepository.find({
            where: {
                status: _billingsubscriptionstatusenum.SubscriptionStatus.Trialing,
                trialEnd: (0, _typeorm1.Between)(now, windowEnd)
            },
            relations: [
                'billingCustomer'
            ]
        });
        for (const subscription of trialingSubscriptions){
            const trialEnd = subscription.trialEnd;
            if (!(0, _utils.isDefined)(trialEnd)) {
                continue;
            }
            const daysUntilTrialEnd = (0, _datefns.differenceInCalendarDays)(trialEnd, now);
            if (daysUntilTrialEnd < 0) {
                continue;
            }
            const isWithCardTrial = this.isWithCreditCardTrial(subscription);
            let reminder;
            if (isWithCardTrial && daysUntilTrialEnd <= withCardDaysBefore) {
                reminder = {
                    type: 'trial-converting',
                    trialEndsAt: trialEnd,
                    interval: subscription.interval === _billingsubscriptionintervalenum.SubscriptionInterval.Year ? 'year' : 'month'
                };
            } else if (!isWithCardTrial && daysUntilTrialEnd <= withoutCardDaysBefore) {
                reminder = {
                    type: 'trial-ending',
                    trialEndsAt: trialEnd
                };
            }
            if (!(0, _utils.isDefined)(reminder)) {
                continue;
            }
            await this.sendReminderIfNotAlreadySent({
                workspaceId: subscription.workspaceId,
                sentKey: _billingremindersentkeysconstant.BILLING_TRIAL_REMINDER_SENT_KEY,
                boundary: trialEnd,
                reminder
            });
        }
    }
    async processRenewalReminders(now) {
        const renewalDaysBefore = this.twentyConfigService.get('BILLING_SUBSCRIPTION_RENEWAL_REMINDER_DAYS_BEFORE');
        const windowEnd = (0, _datefns.addDays)(now, renewalDaysBefore + 1);
        // Only yearly subscriptions get a renewal reminder; monthly ones would be noise.
        const renewingSubscriptions = await this.billingSubscriptionRepository.find({
            where: {
                status: _billingsubscriptionstatusenum.SubscriptionStatus.Active,
                interval: _billingsubscriptionintervalenum.SubscriptionInterval.Year,
                cancelAtPeriodEnd: false,
                currentPeriodEnd: (0, _typeorm1.Between)(now, windowEnd)
            }
        });
        for (const subscription of renewingSubscriptions){
            const renewsAt = subscription.currentPeriodEnd;
            const daysUntilRenewal = (0, _datefns.differenceInCalendarDays)(renewsAt, now);
            if (daysUntilRenewal < 0 || daysUntilRenewal > renewalDaysBefore) {
                continue;
            }
            await this.sendReminderIfNotAlreadySent({
                workspaceId: subscription.workspaceId,
                sentKey: _billingremindersentkeysconstant.BILLING_RENEWAL_REMINDER_SENT_KEY,
                boundary: renewsAt,
                reminder: {
                    type: 'subscription-renewing',
                    renewsAt
                }
            });
        }
    }
    isWithCreditCardTrial(subscription) {
        if (subscription.billingCustomer?.hasPaymentMethod === true) {
            return true;
        }
        if (!(0, _utils.isDefined)(subscription.trialEnd)) {
            return false;
        }
        // Fallback when the payment-method flag isn't synced yet: a with-credit-card trial
        // is longer than a no-credit-card one, so the trial duration disambiguates. Fall back
        // to createdAt when trialStart is missing so this still holds during sync gaps —
        // otherwise a real card-on-file trial could be misread as no-card and wrongly told
        // "no card will be charged" right before it is actually charged.
        const withoutCardTrialDurationDays = this.twentyConfigService.get('BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS');
        const trialStartedAt = subscription.trialStart ?? subscription.createdAt;
        return (0, _datefns.differenceInCalendarDays)(subscription.trialEnd, trialStartedAt) > withoutCardTrialDurationDays;
    }
    async sendReminderIfNotAlreadySent({ workspaceId, sentKey, boundary, reminder }) {
        try {
            const boundaryValue = boundary.toISOString();
            const alreadySentBoundary = await this.userVarsService.get({
                workspaceId,
                key: sentKey
            });
            if (alreadySentBoundary === boundaryValue) {
                return;
            }
            const workspace = await this.workspaceRepository.findOne({
                where: {
                    id: workspaceId,
                    activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
                }
            });
            if (!(0, _utils.isDefined)(workspace)) {
                return;
            }
            const workspaceMembers = await this.userService.loadWorkspaceMembers(workspace);
            const billingSettingsUrl = this.workspaceDomainsService.buildWorkspaceURL({
                workspace,
                pathname: (0, _utils.getSettingsPath)(_types.SettingsPath.Billing)
            }).toString();
            for (const workspaceMember of workspaceMembers){
                await this.sendReminderEmail({
                    workspaceMember,
                    workspaceDisplayName: workspace.displayName,
                    billingSettingsUrl,
                    reminder
                });
            }
            await this.userVarsService.set({
                workspaceId,
                key: sentKey,
                value: boundaryValue
            });
        } catch (error) {
            this.logger.error(`Failed to send ${reminder.type} reminder for workspace ${workspaceId}: ${error}`);
        }
    }
    async sendReminderEmail({ workspaceMember, workspaceDisplayName, billingSettingsUrl, reminder }) {
        if (!(0, _utils.isDefined)(workspaceMember.userEmail)) {
            return;
        }
        const userName = `${workspaceMember.name.firstName} ${workspaceMember.name.lastName}`;
        const locale = workspaceMember.locale;
        const i18n = this.i18nService.getI18nInstance(locale);
        const { emailTemplate, subject } = this.buildReminderEmail({
            reminder,
            userName,
            workspaceDisplayName,
            billingSettingsUrl,
            locale
        });
        const html = await (0, _twentyemails.renderEmail)(emailTemplate, {
            pretty: true
        });
        const text = await (0, _twentyemails.renderEmail)(emailTemplate, {
            plainText: true
        });
        await this.emailService.send({
            to: workspaceMember.userEmail,
            from: `${this.twentyConfigService.get('EMAIL_FROM_NAME')} <${this.twentyConfigService.get('EMAIL_FROM_ADDRESS')}>`,
            subject: i18n._(subject),
            html,
            text
        });
    }
    buildReminderEmail({ reminder, userName, workspaceDisplayName, billingSettingsUrl, locale }) {
        switch(reminder.type){
            case 'trial-ending':
                return {
                    subject: /*i18n*/ {
                        id: "qW+K5e",
                        message: "Your Twenty trial is ending soon"
                    },
                    emailTemplate: (0, _twentyemails.BillingTrialEndingEmail)({
                        userName,
                        workspaceDisplayName,
                        trialEndsAt: reminder.trialEndsAt,
                        dataRetentionDays: this.twentyConfigService.get('WORKSPACE_INACTIVE_DAYS_BEFORE_SOFT_DELETION'),
                        link: billingSettingsUrl,
                        locale
                    })
                };
            case 'trial-converting':
                return {
                    subject: /*i18n*/ {
                        id: "TF/ZV2",
                        message: "A heads up before your Twenty trial ends"
                    },
                    emailTemplate: (0, _twentyemails.BillingTrialConvertingEmail)({
                        userName,
                        workspaceDisplayName,
                        trialEndsAt: reminder.trialEndsAt,
                        interval: reminder.interval,
                        link: billingSettingsUrl,
                        locale
                    })
                };
            case 'subscription-renewing':
                return {
                    subject: /*i18n*/ {
                        id: "sOfbGC",
                        message: "Your Twenty plan renews soon"
                    },
                    emailTemplate: (0, _twentyemails.BillingSubscriptionRenewingEmail)({
                        userName,
                        workspaceDisplayName,
                        renewsAt: reminder.renewsAt,
                        link: billingSettingsUrl,
                        locale
                    })
                };
        }
    }
    constructor(twentyConfigService, // Billing reminders run as a cross-workspace cron, so no workspaceId is in scope.
    // eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    billingSubscriptionRepository, workspaceRepository, userService, userVarsService, emailService, i18nService, workspaceDomainsService){
        this.twentyConfigService = twentyConfigService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.workspaceRepository = workspaceRepository;
        this.userService = userService;
        this.userVarsService = userVarsService;
        this.emailService = emailService;
        this.i18nService = i18nService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.logger = new _common.Logger(BillingReminderService.name);
    }
};
BillingReminderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _uservarsservice.UserVarsService === "undefined" ? Object : _uservarsservice.UserVarsService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService
    ])
], BillingReminderService);

//# sourceMappingURL=billing-reminder.service.js.map