"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingModule", {
    enumerable: true,
    get: function() {
        return EmailingModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingmodule = require("../../engine/core-modules/billing/billing.module");
const _emailingdomainmodule = require("../../engine/core-modules/emailing-domain/emailing-domain.module");
const _emailingdomainentity = require("../../engine/core-modules/emailing-domain/emailing-domain.entity");
const _campaigndeliveryentity = require("../../engine/core-modules/emailing-domain/campaign-delivery.entity");
const _messagesuppressionentity = require("../../engine/core-modules/emailing-domain/message-suppression.entity");
const _unsubscribetopicentity = require("../../engine/core-modules/emailing-domain/unsubscribe-topic.entity");
const _featureflagmodule = require("../../engine/core-modules/feature-flag/feature-flag.module");
const _usagemodule = require("../../engine/core-modules/usage/usage.module");
const _messagechannelentity = require("../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _workspaceentity = require("../../engine/core-modules/workspace/workspace.entity");
const _messagechannelmetadatamodule = require("../../engine/metadata-modules/message-channel/message-channel-metadata.module");
const _permissionsmodule = require("../../engine/metadata-modules/permissions/permissions.module");
const _userrolemodule = require("../../engine/metadata-modules/user-role/user-role.module");
const _workspacemanyorallflatentitymapscachemodule = require("../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _provideworkspacescopedrepository = require("../../engine/twenty-orm/workspace-scoped-repository/provide-workspace-scoped-repository");
const _workspacecachemodule = require("../../engine/workspace-cache/workspace-cache.module");
const _workspaceeventemittermodule = require("../../engine/workspace-event-emitter/workspace-event-emitter.module");
const _usagelimitmodule = require("../../engine/core-modules/usage-limit/usage-limit.module");
const _unsubscribecontroller = require("./controllers/unsubscribe.controller");
const _emailingongoingstalecroncommand = require("./crons/commands/emailing-ongoing-stale.cron.command");
const _emailingongoingstalecronjob = require("./crons/jobs/emailing-ongoing-stale.cron.job");
const _reconcilecampaignstatscroncommand = require("./crons/commands/reconcile-campaign-stats.cron.command");
const _reconcilecampaignstatscronjob = require("./crons/jobs/reconcile-campaign-stats.cron.job");
const _emailingsendresolver = require("./resolvers/emailing-send.resolver");
const _messagesuppressionresolver = require("./resolvers/message-suppression.resolver");
const _unsubscribetopicresolver = require("./resolvers/unsubscribe-topic.resolver");
const _campaignvariableservice = require("./services/campaign-variable.service");
const _throttlermodule = require("../../engine/core-modules/throttler/throttler.module");
const _emailbillingservice = require("./services/email-billing.service");
const _emailingdomainsenderservice = require("./services/emailing-domain-sender.service");
const _messagecampaigndraftservice = require("./services/message-campaign-draft.service");
const _messagecampaignrecoveryservice = require("./services/message-campaign-recovery.service");
const _messagecampaignstatisticsservice = require("./services/message-campaign-statistics.service");
const _messagecampaignaudienceservice = require("./services/message-campaign-audience.service");
const _messagecampaigndeliveryfeedbackservice = require("./services/message-campaign-delivery-feedback.service");
const _messagecampaigndeliveryservice = require("./services/message-campaign-delivery.service");
const _messagecampaignlifecycleservice = require("./services/message-campaign-lifecycle.service");
const _messagecampaignmaterializationservice = require("./services/message-campaign-materialization.service");
const _messagecampaignservice = require("./services/message-campaign.service");
const _messagesuppressionservice = require("./services/message-suppression.service");
const _unsubscribetopicservice = require("./services/unsubscribe-topic.service");
const _savecampaigntool = require("./tools/save-campaign-tool");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EmailingModule = class EmailingModule {
};
EmailingModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _emailingdomainmodule.EmailingDomainModule,
            _throttlermodule.ThrottlerModule,
            _messagechannelmetadatamodule.MessageChannelMetadataModule,
            _featureflagmodule.FeatureFlagModule,
            _permissionsmodule.PermissionsModule,
            _userrolemodule.UserRoleModule,
            _billingmodule.BillingModule,
            _usagemodule.UsageModule,
            _workspaceeventemittermodule.WorkspaceEventEmitterModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _usagelimitmodule.UsageLimitModule,
            _typeorm.TypeOrmModule.forFeature([
                _messagechannelentity.MessageChannelEntity,
                _emailingdomainentity.EmailingDomainEntity,
                _messagesuppressionentity.MessageSuppressionEntity,
                _unsubscribetopicentity.UnsubscribeTopicEntity,
                _campaigndeliveryentity.CampaignDeliveryEntity,
                _workspaceentity.WorkspaceEntity
            ])
        ],
        controllers: [
            _unsubscribecontroller.UnsubscribeController
        ],
        providers: [
            _campaignvariableservice.CampaignVariableService,
            _emailbillingservice.EmailBillingService,
            _messagecampaignservice.MessageCampaignService,
            _messagecampaignaudienceservice.MessageCampaignAudienceService,
            _messagecampaigndeliveryservice.MessageCampaignDeliveryService,
            _messagecampaigndeliveryfeedbackservice.MessageCampaignDeliveryFeedbackService,
            _messagecampaignlifecycleservice.MessageCampaignLifecycleService,
            _messagecampaignmaterializationservice.MessageCampaignMaterializationService,
            _messagecampaigndraftservice.MessageCampaignDraftService,
            _messagecampaignrecoveryservice.MessageCampaignRecoveryService,
            _messagecampaignstatisticsservice.MessageCampaignStatisticsService,
            _messagesuppressionservice.MessageSuppressionService,
            _unsubscribetopicservice.UnsubscribeTopicService,
            _emailingdomainsenderservice.EmailingDomainSenderService,
            _savecampaigntool.SaveCampaignTool,
            _emailingsendresolver.EmailingSendResolver,
            _messagesuppressionresolver.MessageSuppressionResolver,
            _unsubscribetopicresolver.UnsubscribeTopicResolver,
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_emailingdomainentity.EmailingDomainEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_messagesuppressionentity.MessageSuppressionEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_unsubscribetopicentity.UnsubscribeTopicEntity),
            (0, _provideworkspacescopedrepository.provideWorkspaceScopedRepository)(_campaigndeliveryentity.CampaignDeliveryEntity),
            _emailingongoingstalecroncommand.EmailingOngoingStaleCronCommand,
            _emailingongoingstalecronjob.EmailingOngoingStaleCronJob,
            _reconcilecampaignstatscroncommand.ReconcileCampaignStatsCronCommand,
            _reconcilecampaignstatscronjob.ReconcileCampaignStatsCronJob
        ],
        exports: [
            _emailingdomainsenderservice.EmailingDomainSenderService,
            _emailbillingservice.EmailBillingService,
            _messagecampaignservice.MessageCampaignService,
            _messagecampaigndeliveryservice.MessageCampaignDeliveryService,
            _messagecampaigndeliveryfeedbackservice.MessageCampaignDeliveryFeedbackService,
            _messagecampaignmaterializationservice.MessageCampaignMaterializationService,
            _messagecampaigndraftservice.MessageCampaignDraftService,
            _messagecampaignstatisticsservice.MessageCampaignStatisticsService,
            _messagesuppressionservice.MessageSuppressionService,
            _unsubscribetopicservice.UnsubscribeTopicService,
            _savecampaigntool.SaveCampaignTool,
            _emailingongoingstalecroncommand.EmailingOngoingStaleCronCommand,
            _reconcilecampaignstatscroncommand.ReconcileCampaignStatsCronCommand
        ]
    })
], EmailingModule);

//# sourceMappingURL=emailing.module.js.map