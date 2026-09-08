"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelServerAdminService", {
    enumerable: true,
    get: function() {
        return AdminPanelServerAdminService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _twentyemails = require("twenty-emails");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _coreentitycacheservice = require("../../../core-entity-cache/services/core-entity-cache.service");
const _emailservice = require("../../email/email.service");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _serveradminaccesschanged = require("../../event-logs/emit/events/workspace-event/server-admin/server-admin-access-changed");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _i18nservice = require("../../i18n/i18n.service");
const _nodeenvironmentinterface = require("../../twenty-config/interfaces/node-environment.interface");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _twofactorauthenticationservice = require("../../two-factor-authentication/two-factor-authentication.service");
const _twofactorauthenticationvalidation = require("../../two-factor-authentication/two-factor-authentication.validation");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _userentity = require("../../user/user.entity");
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
let AdminPanelServerAdminService = class AdminPanelServerAdminService {
    async getServerAdmins() {
        const admins = await this.userRepository.find({
            where: [
                {
                    canAccessFullAdminPanel: true
                },
                {
                    canImpersonate: true
                }
            ],
            order: {
                firstName: 'ASC',
                lastName: 'ASC'
            }
        });
        return admins.map((admin)=>this.toServerAdminDTO(admin));
    }
    async updateServerAdminAccess({ actor, actorWorkspaceId, targetUserId, canAccessFullAdminPanel, canImpersonate, otp }) {
        if (!(0, _utils.isDefined)(canAccessFullAdminPanel) && !(0, _utils.isDefined)(canImpersonate)) {
            throw new _graphqlerrorsutil.UserInputError('No administrator access change was provided.');
        }
        const targetUser = await this.userRepository.findOne({
            where: {
                id: targetUserId
            }
        });
        if (!(0, _utils.isDefined)(targetUser)) {
            throw new _graphqlerrorsutil.UserInputError('User not found.');
        }
        await this.assertFreshStepUpAuthentication({
            actorUserId: actor.id,
            actorWorkspaceId,
            otp
        });
        const nextCanAccessFullAdminPanel = canAccessFullAdminPanel ?? targetUser.canAccessFullAdminPanel;
        const nextCanImpersonate = canImpersonate ?? targetUser.canImpersonate;
        const hasChange = nextCanAccessFullAdminPanel !== targetUser.canAccessFullAdminPanel || nextCanImpersonate !== targetUser.canImpersonate;
        if (!hasChange) {
            return this.toServerAdminDTO(targetUser);
        }
        const isRevokingFullAdmin = targetUser.canAccessFullAdminPanel === true && nextCanAccessFullAdminPanel === false;
        targetUser.canAccessFullAdminPanel = nextCanAccessFullAdminPanel;
        targetUser.canImpersonate = nextCanImpersonate;
        await this.userRepository.manager.transaction(async (manager)=>{
            if (isRevokingFullAdmin) {
                const lockedFullAdmins = await manager.find(_userentity.UserEntity, {
                    where: {
                        canAccessFullAdminPanel: true
                    },
                    lock: {
                        mode: 'pessimistic_write'
                    }
                });
                const otherFullAdmins = lockedFullAdmins.filter((admin)=>admin.id !== targetUserId);
                if (otherFullAdmins.length === 0) {
                    throw new _graphqlerrorsutil.UserInputError('You cannot revoke admin panel access from the last server administrator.', {
                        userFriendlyMessage: /*i18n*/ {
                            id: "XFR5me",
                            message: "You cannot revoke admin panel access from the last server administrator."
                        }
                    });
                }
            }
            await manager.save(_userentity.UserEntity, targetUser);
        });
        await this.coreEntityCacheService.invalidate('user', targetUserId);
        this.logger.log(`Server admin access for user ${targetUserId} updated by ${actor.id}: ` + `canAccessFullAdminPanel=${nextCanAccessFullAdminPanel}, canImpersonate=${nextCanImpersonate}`);
        this.emitServerAdminAccessChangedEvent({
            actor,
            actorWorkspaceId,
            targetUser
        });
        await this.notifyAdministrators({
            actor,
            targetUser
        });
        return this.toServerAdminDTO(targetUser);
    }
    async assertFreshStepUpAuthentication({ actorUserId, actorWorkspaceId, otp }) {
        const isDevelopment = this.twentyConfigService.get('NODE_ENV') === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT;
        if (isDevelopment) {
            return;
        }
        if (!(0, _guards.isNonEmptyString)(otp)) {
            throw new _graphqlerrorsutil.UserInputError('A two-factor authentication code is required to change server administrator access.', {
                userFriendlyMessage: /*i18n*/ {
                    id: "vNNSFX",
                    message: "Enter your two-factor authentication code to manage server administrators."
                }
            });
        }
        // Verify against the actor's current workspace only — checking the same code
        // against every workspace they belong to would allow one OTP guess per
        // workspace, weakening brute-force resistance.
        const actorUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId: actorUserId,
                workspaceId: actorWorkspaceId
            },
            relations: [
                'twoFactorAuthenticationMethods'
            ]
        });
        const hasVerifiedTwoFactor = (0, _utils.isDefined)(actorUserWorkspace) && _twofactorauthenticationvalidation.twoFactorAuthenticationMethodsValidator.areDefined(actorUserWorkspace.twoFactorAuthenticationMethods) && _twofactorauthenticationvalidation.twoFactorAuthenticationMethodsValidator.areVerified(actorUserWorkspace.twoFactorAuthenticationMethods);
        if (!hasVerifiedTwoFactor) {
            throw new _graphqlerrorsutil.UserInputError('Enable two-factor authentication in your current workspace to manage server administrators.', {
                userFriendlyMessage: /*i18n*/ {
                    id: "ovnbNI",
                    message: "Enable two-factor authentication in your current workspace to manage server administrators."
                }
            });
        }
        // A wrong code throws INVALID_OTP, which the resolver's
        // TwoFactorAuthenticationExceptionFilter maps to a user-friendly message.
        await this.twoFactorAuthenticationService.verifyTwoFactorAuthenticationMethodForAuthenticatedUser(actorUserId, otp, actorWorkspaceId);
    }
    async notifyAdministrators({ actor, targetUser }) {
        try {
            const fullAdmins = await this.userRepository.find({
                where: {
                    canAccessFullAdminPanel: true
                }
            });
            const recipientsById = new Map();
            for (const fullAdmin of fullAdmins){
                recipientsById.set(fullAdmin.id, fullAdmin);
            }
            recipientsById.set(targetUser.id, targetUser);
            const actorName = `${actor.firstName} ${actor.lastName}`.trim();
            const targetName = `${targetUser.firstName} ${targetUser.lastName}`.trim();
            const from = `${this.twentyConfigService.get('EMAIL_FROM_NAME')} <${this.twentyConfigService.get('EMAIL_FROM_ADDRESS')}>`;
            const recipientsByLocale = new Map();
            for (const recipient of recipientsById.values()){
                const locale = recipient.locale || _translations.SOURCE_LOCALE;
                const localeRecipients = recipientsByLocale.get(locale) ?? [];
                localeRecipients.push(recipient);
                recipientsByLocale.set(locale, localeRecipients);
            }
            await Promise.allSettled(Array.from(recipientsByLocale.entries()).map(async ([locale, recipients])=>{
                const emailTemplate = (0, _twentyemails.ServerAdminAccessChangedEmail)({
                    actorName,
                    targetName,
                    targetEmail: targetUser.email,
                    canAccessFullAdminPanel: targetUser.canAccessFullAdminPanel,
                    canImpersonate: targetUser.canImpersonate,
                    locale
                });
                const html = await (0, _twentyemails.renderEmail)(emailTemplate, {
                    pretty: true
                });
                const text = await (0, _twentyemails.renderEmail)(emailTemplate, {
                    plainText: true
                });
                const i18n = this.i18nService.getI18nInstance(locale);
                const subject = i18n._(/*i18n*/ {
                    id: "tYtTv9",
                    message: "Server administrator access changed"
                });
                const sendResults = await Promise.allSettled(recipients.map((recipient)=>this.emailService.send({
                        from,
                        to: recipient.email,
                        subject,
                        text,
                        html
                    })));
                const failedCount = sendResults.filter((result)=>result.status === 'rejected').length;
                if (failedCount > 0) {
                    this.logger.error(`Failed to enqueue ${failedCount} server admin access notification email(s) for locale ${locale}`);
                }
            }));
        } catch (error) {
            this.logger.error('Failed to send server admin access change notifications', error);
        }
    }
    emitServerAdminAccessChangedEvent({ actor, actorWorkspaceId, targetUser }) {
        void this.eventLogEmitterService.createContext({
            workspaceId: actorWorkspaceId,
            userId: actor.id
        }).insertWorkspaceEvent(_serveradminaccesschanged.SERVER_ADMIN_ACCESS_CHANGED_EVENT, {
            targetUserId: targetUser.id,
            canAccessFullAdminPanel: targetUser.canAccessFullAdminPanel,
            canImpersonate: targetUser.canImpersonate,
            message: `Server admin access for user ${targetUser.id} changed by ${actor.id}`
        });
    }
    toServerAdminDTO(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            canAccessFullAdminPanel: user.canAccessFullAdminPanel,
            canImpersonate: user.canImpersonate
        };
    }
    constructor(userRepository, userWorkspaceRepository, coreEntityCacheService, twoFactorAuthenticationService, emailService, i18nService, twentyConfigService, eventLogEmitterService){
        this.userRepository = userRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.coreEntityCacheService = coreEntityCacheService;
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.emailService = emailService;
        this.i18nService = i18nService;
        this.twentyConfigService = twentyConfigService;
        this.eventLogEmitterService = eventLogEmitterService;
        this.logger = new _common.Logger(AdminPanelServerAdminService.name);
    }
};
AdminPanelServerAdminService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService,
        typeof _twofactorauthenticationservice.TwoFactorAuthenticationService === "undefined" ? Object : _twofactorauthenticationservice.TwoFactorAuthenticationService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService
    ])
], AdminPanelServerAdminService);

//# sourceMappingURL=admin-panel-server-admin.service.js.map