"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JobsModule", {
    enumerable: true,
    get: function() {
        return JobsModule;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _typeorm = require("@nestjs/typeorm");
const _typeormmodule = require("../../../database/typeorm/typeorm.module");
const _authmodule = require("../auth/auth.module");
const _billingmodule = require("../billing/billing.module");
const _billingproductentity = require("../billing/entities/billing-product.entity");
const _billingsubscriptionitementity = require("../billing/entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("../billing/entities/billing-subscription.entity");
const _updatesubscriptionquantityjob = require("../billing/jobs/update-subscription-quantity.job");
const _billingremindermodule = require("../billing/reminders/billing-reminder.module");
const _billingremindercronjob = require("../billing/reminders/crons/billing-reminder.cron.job");
const _stripemodule = require("../billing/stripe/stripe.module");
const _applicationinstallmodule = require("../application/application-install/application-install.module");
const _applicationmanifestmodule = require("../application/application-manifest/application-manifest.module");
const _applicationregistrationmodule = require("../application/application-registration/application-registration.module");
const _applicationupgrademodule = require("../application/application-upgrade/application-upgrade.module");
const _upgradeapplicationsjob = require("../application/jobs/upgrade-applications.job");
const _installpreinstalledappsjob = require("../application/pre-installed-apps/jobs/install-pre-installed-apps.job");
const _preinstalledappsmodule = require("../application/pre-installed-apps/pre-installed-apps.module");
const _installonboardingappsjob = require("../onboarding/jobs/install-onboarding-apps.job");
const _onboardingmodule = require("../onboarding/onboarding.module");
const _emailsenderjob = require("../email/email-sender.job");
const _emailmodule = require("../email/email.module");
const _emailingmodule = require("../../../modules/emailing/emailing.module");
const _materializecampaignchunkjob = require("../../../modules/emailing/jobs/materialize-campaign-chunk.job");
const _materializecampaignjob = require("../../../modules/emailing/jobs/materialize-campaign.job");
const _reconcileworkspacecampaignstatsjob = require("../../../modules/emailing/jobs/reconcile-workspace-campaign-stats.job");
const _refreshcampaignstatsjob = require("../../../modules/emailing/jobs/refresh-campaign-stats.job");
const _sendcampaignemailjob = require("../../../modules/emailing/jobs/send-campaign-email.job");
const _enterprisemodule = require("../enterprise/enterprise.module");
const _eventlogingestionmodule = require("../event-logs/ingest/event-log-ingestion.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _generatesdkclientjob = require("../sdk-client/jobs/generate-sdk-client.job");
const _sdkclientmodule = require("../sdk-client/sdk-client.module");
const _userworkspacemodule = require("../user-workspace/user-workspace.module");
const _updateworkspacememberemailjob = require("../user/jobs/update-workspace-member-email.job");
const _uservarsmodule = require("../user/user-vars/user-vars.module");
const _usermodule = require("../user/user.module");
const _handleworkspacememberdeletedjob = require("../workspace/handle-workspace-member-deleted.job");
const _workspacedeletionapplicationuninstalljob = require("../workspace/jobs/workspace-deletion-application-uninstall.job");
const _workspaceentity = require("../workspace/workspace.entity");
const _workspacemodule = require("../workspace/workspace.module");
const _aiagentmonitormodule = require("../../metadata-modules/ai/ai-agent-monitor/ai-agent-monitor.module");
const _aichatmodule = require("../../metadata-modules/ai/ai-chat/ai-chat.module");
const _logicfunctionmodule = require("../../metadata-modules/logic-function/logic-function.module");
const _navigationmenuitemmodule = require("../../metadata-modules/navigation-menu-item/navigation-menu-item.module");
const _objectmetadatamodule = require("../../metadata-modules/object-metadata/object-metadata.module");
const _webhookjobmodule = require("../../metadata-modules/webhook/jobs/webhook-job.module");
const _subscriptionsmodule = require("../../subscriptions/subscriptions.module");
const _cleanonboardingworkspacesjob = require("../../workspace-manager/workspace-cleaner/crons/clean-onboarding-workspaces.job");
const _cleansuspendedworkspacesjob = require("../../workspace-manager/workspace-cleaner/crons/clean-suspended-workspaces.job");
const _cleanworkspacedeletionwarninguservarsjob = require("../../workspace-manager/workspace-cleaner/jobs/clean-workspace-deletion-warning-user-vars.job");
const _workspacecleanermodule = require("../../workspace-manager/workspace-cleaner/workspace-cleaner.module");
const _calendareventparticipantmanagermodule = require("../../../modules/calendar/calendar-event-participant-manager/calendar-event-participant-manager.module");
const _calendarmodule = require("../../../modules/calendar/calendar.module");
const _autocompaniesandcontactscreationjobmodule = require("../../../modules/contact-creation-manager/jobs/auto-companies-and-contacts-creation-job.module");
const _messagingmodule = require("../../../modules/messaging/messaging.module");
const _timelinejobmodule = require("../../../modules/timeline/jobs/timeline-job.module");
const _timelineactivitymodule = require("../../../modules/timeline/timeline-activity.module");
const _workflowmodule = require("../../../modules/workflow/workflow.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JobsModule = class JobsModule {
    constructor(moduleRef){
        this.moduleRef = moduleRef;
        JobsModule.moduleRef = this.moduleRef;
    }
};
JobsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _billingsubscriptionentity.BillingSubscriptionEntity,
                _billingsubscriptionitementity.BillingSubscriptionItemEntity,
                _billingproductentity.BillingProductEntity
            ]),
            _objectmetadatamodule.ObjectMetadataModule,
            _typeormmodule.TypeORMModule,
            _usermodule.UserModule,
            _uservarsmodule.UserVarsModule,
            _emailmodule.EmailModule,
            _billingmodule.BillingModule,
            _userworkspacemodule.UserWorkspaceModule,
            _workspacemodule.WorkspaceModule,
            _authmodule.AuthModule,
            _messagingmodule.MessagingModule,
            _calendarmodule.CalendarModule,
            _calendareventparticipantmanagermodule.CalendarEventParticipantManagerModule,
            _timelineactivitymodule.TimelineActivityModule,
            _stripemodule.StripeModule,
            _featureflagmodule.FeatureFlagModule,
            _autocompaniesandcontactscreationjobmodule.AutoCompaniesAndContactsCreationJobModule,
            _timelinejobmodule.TimelineJobModule,
            _webhookjobmodule.WebhookJobModule,
            _workflowmodule.WorkflowModule,
            _navigationmenuitemmodule.NavigationMenuItemModule,
            _sdkclientmodule.SdkClientModule,
            _workspacecleanermodule.WorkspaceCleanerModule,
            _subscriptionsmodule.SubscriptionsModule,
            _eventlogingestionmodule.EventLogIngestionModule,
            _aiagentmonitormodule.AiAgentMonitorModule,
            _aichatmodule.AiChatModule,
            _logicfunctionmodule.LogicFunctionModule,
            _enterprisemodule.EnterpriseModule,
            _emailingmodule.EmailingModule,
            _applicationinstallmodule.ApplicationInstallModule,
            _applicationmanifestmodule.ApplicationManifestModule,
            _applicationregistrationmodule.ApplicationRegistrationModule,
            _applicationupgrademodule.ApplicationUpgradeModule,
            _preinstalledappsmodule.PreInstalledAppsModule,
            _onboardingmodule.OnboardingModule,
            _billingremindermodule.BillingReminderModule
        ],
        providers: [
            _billingremindercronjob.BillingReminderCronJob,
            _cleansuspendedworkspacesjob.CleanSuspendedWorkspacesJob,
            _cleanonboardingworkspacesjob.CleanOnboardingWorkspacesJob,
            _emailsenderjob.EmailSenderJob,
            _sendcampaignemailjob.SendCampaignEmailJob,
            _materializecampaignjob.MaterializeCampaignJob,
            _materializecampaignchunkjob.MaterializeCampaignChunkJob,
            _refreshcampaignstatsjob.RefreshCampaignStatsJob,
            _reconcileworkspacecampaignstatsjob.ReconcileWorkspaceCampaignStatsJob,
            _updatesubscriptionquantityjob.UpdateSubscriptionQuantityJob,
            _handleworkspacememberdeletedjob.HandleWorkspaceMemberDeletedJob,
            _workspacedeletionapplicationuninstalljob.WorkspaceDeletionApplicationUninstallJob,
            _cleanworkspacedeletionwarninguservarsjob.CleanWorkspaceDeletionWarningUserVarsJob,
            _updateworkspacememberemailjob.UpdateWorkspaceMemberEmailJob,
            _generatesdkclientjob.GenerateSdkClientJob,
            _upgradeapplicationsjob.UpgradeApplicationsJob,
            _installonboardingappsjob.InstallOnboardingAppsJob,
            _installpreinstalledappsjob.InstallPreInstalledAppsJob
        ]
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.ModuleRef === "undefined" ? Object : _core.ModuleRef
    ])
], JobsModule);

//# sourceMappingURL=jobs.module.js.map