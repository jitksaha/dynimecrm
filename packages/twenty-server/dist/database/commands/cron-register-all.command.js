"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CronRegisterAllCommand", {
    enumerable: true,
    get: function() {
        return CronRegisterAllCommand;
    }
});
const _common = require("@nestjs/common");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _marketplacecatalogsynccroncommand = require("../../engine/core-modules/application/application-marketplace/crons/commands/marketplace-catalog-sync.cron.command");
const _staleregistrationcleanupcroncommand = require("../../engine/core-modules/application/application-oauth/stale-registration-cleanup/commands/stale-registration-cleanup.cron.command");
const _applicationversioncheckcroncommand = require("../../engine/core-modules/application/application-upgrade/crons/commands/application-version-check.cron.command");
const _billingremindercroncommand = require("../../engine/core-modules/billing/reminders/crons/commands/billing-reminder.cron.command");
const _checkemailingdomainverificationcroncommand = require("../../engine/core-modules/emailing-domain/crons/commands/check-emailing-domain-verification.cron.command");
const _enterprisekeyvalidationcroncommand = require("../../engine/core-modules/enterprise/cron/command/enterprise-key-validation.cron.command");
const _eventlogcleanupcroncommand = require("../../engine/core-modules/event-logs/cleanup/commands/event-log-cleanup.cron.command");
const _pendingfilecleanupcroncommand = require("../../engine/core-modules/file/file-upload/crons/commands/pending-file-cleanup.cron.command");
const _rotatesigningkeyscroncommand = require("../../engine/core-modules/jwt/crons/commands/rotate-signing-keys.cron.command");
const _crontriggercroncommand = require("../../engine/core-modules/logic-function/logic-function-trigger/triggers/cron/cron-trigger.cron.command");
const _checkpublicdomainsvalidrecordscroncommand = require("../../engine/core-modules/public-domain/crons/commands/check-public-domains-valid-records.cron.command");
const _twentyconfigservice = require("../../engine/core-modules/twenty-config/twenty-config.service");
const _usersessioncleanupcroncommand = require("../../engine/core-modules/user-session/crons/commands/user-session-cleanup.cron.command");
const _checkcustomdomainvalidrecordscroncommand = require("../../engine/core-modules/workspace/crons/commands/check-custom-domain-valid-records.cron.command");
const _webhooksubscriptionrenewalcroncommand = require("../../modules/connected-account/webhook-subscription-manager/crons/commands/webhook-subscription-renewal.cron.command");
const _emailingongoingstalecroncommand = require("../../modules/emailing/crons/commands/emailing-ongoing-stale.cron.command");
const _reconcilecampaignstatscroncommand = require("../../modules/emailing/crons/commands/reconcile-campaign-stats.cron.command");
const _trashcleanupcroncommand = require("../../engine/trash-cleanup/commands/trash-cleanup.cron.command");
const _cleanonboardingworkspacescroncommand = require("../../engine/workspace-manager/workspace-cleaner/commands/clean-onboarding-workspaces.cron.command");
const _cleansuspendedworkspacescroncommand = require("../../engine/workspace-manager/workspace-cleaner/commands/clean-suspended-workspaces.cron.command");
const _calendareventlistfetchcroncommand = require("../../modules/calendar/calendar-event-import-manager/crons/commands/calendar-event-list-fetch.cron.command");
const _calendarimportcroncommand = require("../../modules/calendar/calendar-event-import-manager/crons/commands/calendar-import.cron.command");
const _calendarongoingstalecroncommand = require("../../modules/calendar/calendar-event-import-manager/crons/commands/calendar-ongoing-stale.cron.command");
const _calendarrelaunchfailedcalendarchannelscroncommand = require("../../modules/calendar/calendar-event-import-manager/crons/commands/calendar-relaunch-failed-calendar-channels.cron.command");
const _messagingmessagelistfetchcroncommand = require("../../modules/messaging/message-import-manager/crons/commands/messaging-message-list-fetch.cron.command");
const _messagingmessagesimportcroncommand = require("../../modules/messaging/message-import-manager/crons/commands/messaging-messages-import.cron.command");
const _messagingongoingstalecroncommand = require("../../modules/messaging/message-import-manager/crons/commands/messaging-ongoing-stale.cron.command");
const _messagingrelaunchfailedmessagechannelscroncommand = require("../../modules/messaging/message-import-manager/crons/commands/messaging-relaunch-failed-message-channels.cron.command");
const _workflowcoreconsistencycroncommand = require("../../modules/workflow/workflow-core-consistency/crons/commands/workflow-core-consistency-cron.command");
const _workflowcleanworkflowrunscroncommand = require("../../modules/workflow/workflow-runner/workflow-run-queue/cron/command/workflow-clean-workflow-runs.cron.command");
const _workflowhandlestaledrunscroncommand = require("../../modules/workflow/workflow-runner/workflow-run-queue/cron/command/workflow-handle-staled-runs.cron.command");
const _workflowrunenqueuecroncommand = require("../../modules/workflow/workflow-runner/workflow-run-queue/cron/command/workflow-run-enqueue.cron.command");
const _workflowcrontriggercroncommand = require("../../modules/workflow/workflow-trigger/automated-trigger/crons/commands/workflow-cron-trigger.cron.command");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CronRegisterAllCommand = class CronRegisterAllCommand extends _nestcommander.CommandRunner {
    async run() {
        this.logger.log('Registering all background sync cron jobs...');
        const isSigningKeyAutoRotationEnabled = (0, _utils.isDefined)(this.twentyConfigService.get('SIGNING_KEY_ROTATION_DAYS'));
        const isMarketplaceCatalogSyncEnabled = this.twentyConfigService.get('MARKETPLACE_CATALOG_SYNC_CRON_ENABLED');
        const isBillingEnabled = this.twentyConfigService.get('IS_BILLING_ENABLED');
        const allCommands = [
            {
                name: 'MessagingMessagesImport',
                command: this.messagingMessagesImportCronCommand
            },
            {
                name: 'MessagingMessageListFetch',
                command: this.messagingMessageListFetchCronCommand
            },
            {
                name: 'MessagingOngoingStale',
                command: this.messagingOngoingStaleCronCommand
            },
            {
                name: 'MessagingRelaunchFailedMessageChannels',
                command: this.messagingRelaunchFailedMessageChannelsCronCommand
            },
            {
                name: 'CalendarEventListFetch',
                command: this.calendarEventListFetchCronCommand
            },
            {
                name: 'CalendarEventsImport',
                command: this.calendarEventsImportCronCommand
            },
            {
                name: 'CalendarOngoingStale',
                command: this.calendarOngoingStaleCronCommand
            },
            {
                name: 'CalendarRelaunchFailedCalendarChannels',
                command: this.calendarRelaunchFailedCalendarChannelsCronCommand
            },
            {
                name: 'WebhookSubscriptionRenewal',
                command: this.webhookSubscriptionRenewalCronCommand
            },
            {
                name: 'EmailingOngoingStale',
                command: this.emailingOngoingStaleCronCommand
            },
            {
                name: 'ReconcileCampaignStats',
                command: this.reconcileCampaignStatsCronCommand
            },
            {
                name: 'CheckCustomDomainValidRecords',
                command: this.checkCustomDomainValidRecordsCronCommand
            },
            {
                name: 'CheckPublicDomainsValidRecords',
                command: this.checkPublicDomainsValidRecordsCronCommand
            },
            {
                name: 'CheckEmailingDomainVerification',
                command: this.checkEmailingDomainVerificationCronCommand
            },
            {
                name: 'WorkflowCronTrigger',
                command: this.workflowCronTriggerCronCommand
            },
            {
                name: 'WorkflowRunEnqueue',
                command: this.workflowRunEnqueueCronCommand
            },
            {
                name: 'WorkflowHandleStaledRuns',
                command: this.workflowHandleStaledRunsCronCommand
            },
            {
                name: 'WorkflowCleanWorkflowRuns',
                command: this.workflowCleanWorkflowRunsCronCommand
            },
            {
                name: 'WorkflowCoreConsistency',
                command: this.workflowCoreConsistencyCronCommand
            },
            {
                name: 'CronTrigger',
                command: this.cronTriggerCronCommand
            },
            {
                name: 'CleanSuspendedWorkspaces',
                command: this.cleanSuspendedWorkspacesCronCommand
            },
            {
                name: 'CleanOnboardingWorkspaces',
                command: this.cleanOnboardingWorkspacesCronCommand
            },
            {
                name: 'TrashCleanup',
                command: this.trashCleanupCronCommand
            },
            {
                name: 'EventLogCleanup',
                command: this.eventLogCleanupCronCommand
            },
            {
                name: 'MarketplaceCatalogSync',
                command: this.marketplaceCatalogSyncCronCommand,
                isEnabled: isMarketplaceCatalogSyncEnabled
            },
            {
                name: 'ApplicationVersionCheck',
                command: this.applicationVersionCheckCronCommand
            },
            {
                name: 'EnterpriseKeyValidation',
                command: this.enterpriseKeyValidationCronCommand
            },
            {
                name: 'RotateSigningKeys',
                command: this.rotateSigningKeysCronCommand,
                isEnabled: isSigningKeyAutoRotationEnabled
            },
            {
                name: 'StaleRegistrationCleanup',
                command: this.staleRegistrationCleanupCronCommand
            },
            {
                name: 'PendingFileCleanup',
                command: this.pendingFileCleanupCronCommand
            },
            {
                name: 'BillingReminder',
                command: this.billingReminderCronCommand,
                isEnabled: isBillingEnabled
            },
            {
                name: 'UserSessionCleanup',
                command: this.userSessionCleanupCronCommand
            }
        ];
        let successCount = 0;
        let failureCount = 0;
        const failures = [];
        const successes = [];
        const skipped = [];
        for (const { name, command, isEnabled = true } of allCommands){
            if (!isEnabled) {
                this.logger.log(`Skipping ${name} cron job (disabled by config)`);
                skipped.push(name);
                continue;
            }
            try {
                this.logger.log(`Registering ${name} cron job...`);
                await command.run();
                this.logger.log(`Successfully registered ${name} cron job`);
                successCount++;
                successes.push(name);
            } catch (error) {
                this.logger.error(`Failed to register ${name} cron job:`, error);
                failureCount++;
                failures.push(name);
            }
        }
        this.logger.log(`Cron job registration completed: ${successCount} successful, ${failureCount} failed, ${skipped.length} skipped`);
        if (failures.length > 0) {
            this.logger.warn(`Failed commands: ${failures.join(', ')}`);
        }
        if (successCount > 0) {
            this.logger.log(`Successful commands: ${successes.join(', ')}`);
        }
        if (skipped.length > 0) {
            this.logger.log(`Skipped commands: ${skipped.join(', ')}`);
        }
    }
    constructor(messagingMessagesImportCronCommand, messagingMessageListFetchCronCommand, messagingOngoingStaleCronCommand, messagingRelaunchFailedMessageChannelsCronCommand, calendarEventListFetchCronCommand, calendarEventsImportCronCommand, calendarOngoingStaleCronCommand, calendarRelaunchFailedCalendarChannelsCronCommand, webhookSubscriptionRenewalCronCommand, emailingOngoingStaleCronCommand, reconcileCampaignStatsCronCommand, workflowCronTriggerCronCommand, workflowRunEnqueueCronCommand, workflowHandleStaledRunsCronCommand, workflowCleanWorkflowRunsCronCommand, workflowCoreConsistencyCronCommand, checkCustomDomainValidRecordsCronCommand, checkPublicDomainsValidRecordsCronCommand, checkEmailingDomainVerificationCronCommand, cronTriggerCronCommand, cleanSuspendedWorkspacesCronCommand, cleanOnboardingWorkspacesCronCommand, trashCleanupCronCommand, eventLogCleanupCronCommand, enterpriseKeyValidationCronCommand, rotateSigningKeysCronCommand, marketplaceCatalogSyncCronCommand, applicationVersionCheckCronCommand, staleRegistrationCleanupCronCommand, pendingFileCleanupCronCommand, billingReminderCronCommand, userSessionCleanupCronCommand, twentyConfigService){
        super(), this.messagingMessagesImportCronCommand = messagingMessagesImportCronCommand, this.messagingMessageListFetchCronCommand = messagingMessageListFetchCronCommand, this.messagingOngoingStaleCronCommand = messagingOngoingStaleCronCommand, this.messagingRelaunchFailedMessageChannelsCronCommand = messagingRelaunchFailedMessageChannelsCronCommand, this.calendarEventListFetchCronCommand = calendarEventListFetchCronCommand, this.calendarEventsImportCronCommand = calendarEventsImportCronCommand, this.calendarOngoingStaleCronCommand = calendarOngoingStaleCronCommand, this.calendarRelaunchFailedCalendarChannelsCronCommand = calendarRelaunchFailedCalendarChannelsCronCommand, this.webhookSubscriptionRenewalCronCommand = webhookSubscriptionRenewalCronCommand, this.emailingOngoingStaleCronCommand = emailingOngoingStaleCronCommand, this.reconcileCampaignStatsCronCommand = reconcileCampaignStatsCronCommand, this.workflowCronTriggerCronCommand = workflowCronTriggerCronCommand, this.workflowRunEnqueueCronCommand = workflowRunEnqueueCronCommand, this.workflowHandleStaledRunsCronCommand = workflowHandleStaledRunsCronCommand, this.workflowCleanWorkflowRunsCronCommand = workflowCleanWorkflowRunsCronCommand, this.workflowCoreConsistencyCronCommand = workflowCoreConsistencyCronCommand, this.checkCustomDomainValidRecordsCronCommand = checkCustomDomainValidRecordsCronCommand, this.checkPublicDomainsValidRecordsCronCommand = checkPublicDomainsValidRecordsCronCommand, this.checkEmailingDomainVerificationCronCommand = checkEmailingDomainVerificationCronCommand, this.cronTriggerCronCommand = cronTriggerCronCommand, this.cleanSuspendedWorkspacesCronCommand = cleanSuspendedWorkspacesCronCommand, this.cleanOnboardingWorkspacesCronCommand = cleanOnboardingWorkspacesCronCommand, this.trashCleanupCronCommand = trashCleanupCronCommand, this.eventLogCleanupCronCommand = eventLogCleanupCronCommand, this.enterpriseKeyValidationCronCommand = enterpriseKeyValidationCronCommand, this.rotateSigningKeysCronCommand = rotateSigningKeysCronCommand, this.marketplaceCatalogSyncCronCommand = marketplaceCatalogSyncCronCommand, this.applicationVersionCheckCronCommand = applicationVersionCheckCronCommand, this.staleRegistrationCleanupCronCommand = staleRegistrationCleanupCronCommand, this.pendingFileCleanupCronCommand = pendingFileCleanupCronCommand, this.billingReminderCronCommand = billingReminderCronCommand, this.userSessionCleanupCronCommand = userSessionCleanupCronCommand, this.twentyConfigService = twentyConfigService, this.logger = new _common.Logger(CronRegisterAllCommand.name);
    }
};
CronRegisterAllCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'cron:register:all',
        description: 'Register all background sync cron jobs'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagingmessagesimportcroncommand.MessagingMessagesImportCronCommand === "undefined" ? Object : _messagingmessagesimportcroncommand.MessagingMessagesImportCronCommand,
        typeof _messagingmessagelistfetchcroncommand.MessagingMessageListFetchCronCommand === "undefined" ? Object : _messagingmessagelistfetchcroncommand.MessagingMessageListFetchCronCommand,
        typeof _messagingongoingstalecroncommand.MessagingOngoingStaleCronCommand === "undefined" ? Object : _messagingongoingstalecroncommand.MessagingOngoingStaleCronCommand,
        typeof _messagingrelaunchfailedmessagechannelscroncommand.MessagingRelaunchFailedMessageChannelsCronCommand === "undefined" ? Object : _messagingrelaunchfailedmessagechannelscroncommand.MessagingRelaunchFailedMessageChannelsCronCommand,
        typeof _calendareventlistfetchcroncommand.CalendarEventListFetchCronCommand === "undefined" ? Object : _calendareventlistfetchcroncommand.CalendarEventListFetchCronCommand,
        typeof _calendarimportcroncommand.CalendarEventsImportCronCommand === "undefined" ? Object : _calendarimportcroncommand.CalendarEventsImportCronCommand,
        typeof _calendarongoingstalecroncommand.CalendarOngoingStaleCronCommand === "undefined" ? Object : _calendarongoingstalecroncommand.CalendarOngoingStaleCronCommand,
        typeof _calendarrelaunchfailedcalendarchannelscroncommand.CalendarRelaunchFailedCalendarChannelsCronCommand === "undefined" ? Object : _calendarrelaunchfailedcalendarchannelscroncommand.CalendarRelaunchFailedCalendarChannelsCronCommand,
        typeof _webhooksubscriptionrenewalcroncommand.WebhookSubscriptionRenewalCronCommand === "undefined" ? Object : _webhooksubscriptionrenewalcroncommand.WebhookSubscriptionRenewalCronCommand,
        typeof _emailingongoingstalecroncommand.EmailingOngoingStaleCronCommand === "undefined" ? Object : _emailingongoingstalecroncommand.EmailingOngoingStaleCronCommand,
        typeof _reconcilecampaignstatscroncommand.ReconcileCampaignStatsCronCommand === "undefined" ? Object : _reconcilecampaignstatscroncommand.ReconcileCampaignStatsCronCommand,
        typeof _workflowcrontriggercroncommand.WorkflowCronTriggerCronCommand === "undefined" ? Object : _workflowcrontriggercroncommand.WorkflowCronTriggerCronCommand,
        typeof _workflowrunenqueuecroncommand.WorkflowRunEnqueueCronCommand === "undefined" ? Object : _workflowrunenqueuecroncommand.WorkflowRunEnqueueCronCommand,
        typeof _workflowhandlestaledrunscroncommand.WorkflowHandleStaledRunsCronCommand === "undefined" ? Object : _workflowhandlestaledrunscroncommand.WorkflowHandleStaledRunsCronCommand,
        typeof _workflowcleanworkflowrunscroncommand.WorkflowCleanWorkflowRunsCronCommand === "undefined" ? Object : _workflowcleanworkflowrunscroncommand.WorkflowCleanWorkflowRunsCronCommand,
        typeof _workflowcoreconsistencycroncommand.WorkflowCoreConsistencyCronCommand === "undefined" ? Object : _workflowcoreconsistencycroncommand.WorkflowCoreConsistencyCronCommand,
        typeof _checkcustomdomainvalidrecordscroncommand.CheckCustomDomainValidRecordsCronCommand === "undefined" ? Object : _checkcustomdomainvalidrecordscroncommand.CheckCustomDomainValidRecordsCronCommand,
        typeof _checkpublicdomainsvalidrecordscroncommand.CheckPublicDomainsValidRecordsCronCommand === "undefined" ? Object : _checkpublicdomainsvalidrecordscroncommand.CheckPublicDomainsValidRecordsCronCommand,
        typeof _checkemailingdomainverificationcroncommand.CheckEmailingDomainVerificationCronCommand === "undefined" ? Object : _checkemailingdomainverificationcroncommand.CheckEmailingDomainVerificationCronCommand,
        typeof _crontriggercroncommand.CronTriggerCronCommand === "undefined" ? Object : _crontriggercroncommand.CronTriggerCronCommand,
        typeof _cleansuspendedworkspacescroncommand.CleanSuspendedWorkspacesCronCommand === "undefined" ? Object : _cleansuspendedworkspacescroncommand.CleanSuspendedWorkspacesCronCommand,
        typeof _cleanonboardingworkspacescroncommand.CleanOnboardingWorkspacesCronCommand === "undefined" ? Object : _cleanonboardingworkspacescroncommand.CleanOnboardingWorkspacesCronCommand,
        typeof _trashcleanupcroncommand.TrashCleanupCronCommand === "undefined" ? Object : _trashcleanupcroncommand.TrashCleanupCronCommand,
        typeof _eventlogcleanupcroncommand.EventLogCleanupCronCommand === "undefined" ? Object : _eventlogcleanupcroncommand.EventLogCleanupCronCommand,
        typeof _enterprisekeyvalidationcroncommand.EnterpriseKeyValidationCronCommand === "undefined" ? Object : _enterprisekeyvalidationcroncommand.EnterpriseKeyValidationCronCommand,
        typeof _rotatesigningkeyscroncommand.RotateSigningKeysCronCommand === "undefined" ? Object : _rotatesigningkeyscroncommand.RotateSigningKeysCronCommand,
        typeof _marketplacecatalogsynccroncommand.MarketplaceCatalogSyncCronCommand === "undefined" ? Object : _marketplacecatalogsynccroncommand.MarketplaceCatalogSyncCronCommand,
        typeof _applicationversioncheckcroncommand.ApplicationVersionCheckCronCommand === "undefined" ? Object : _applicationversioncheckcroncommand.ApplicationVersionCheckCronCommand,
        typeof _staleregistrationcleanupcroncommand.StaleRegistrationCleanupCronCommand === "undefined" ? Object : _staleregistrationcleanupcroncommand.StaleRegistrationCleanupCronCommand,
        typeof _pendingfilecleanupcroncommand.PendingFileCleanupCronCommand === "undefined" ? Object : _pendingfilecleanupcroncommand.PendingFileCleanupCronCommand,
        typeof _billingremindercroncommand.BillingReminderCronCommand === "undefined" ? Object : _billingremindercroncommand.BillingReminderCronCommand,
        typeof _usersessioncleanupcroncommand.UserSessionCleanupCronCommand === "undefined" ? Object : _usersessioncleanupcroncommand.UserSessionCleanupCronCommand,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], CronRegisterAllCommand);

//# sourceMappingURL=cron-register-all.command.js.map