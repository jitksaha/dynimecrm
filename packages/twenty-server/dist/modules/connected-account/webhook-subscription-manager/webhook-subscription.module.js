"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionModule", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceiteratormodule = require("../../../database/commands/command-runners/workspace-iterator.module");
const _featureflagmodule = require("../../../engine/core-modules/feature-flag/feature-flag.module");
const _metricsmodule = require("../../../engine/core-modules/metrics/metrics.module");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _connectedaccountentity = require("../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _calendarchannelentity = require("../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _messagechannelentity = require("../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _createwebhooksubscriptionforconnectedaccountcommand = require("./commands/create-webhook-subscription-for-connected-account.command");
const _webhooksubscriptionrenewalcroncommand = require("./crons/commands/webhook-subscription-renewal.cron.command");
const _createwebhooksubscriptionjob = require("./jobs/create-webhook-subscription.job");
const _renewwebhooksubscriptionjob = require("./jobs/renew-webhook-subscription.job");
const _webhooksubscriptionrenewalcronjob = require("./crons/jobs/webhook-subscription-renewal.cron.job");
const _webhooksubscriptionchanneldeletedlistener = require("./listeners/webhook-subscription-channel-deleted.listener");
const _calendarwebhooksubscriptionservice = require("./services/calendar-webhook-subscription.service");
const _messagingwebhooksubscriptionservice = require("./services/messaging-webhook-subscription.service");
const _webhooksubscriptionexceptionhandlerservice = require("./services/webhook-subscription-exception-handler.service");
const _webhooksubscriptionstatusservice = require("./services/webhook-subscription-status.service");
const _webhooksubscriptionmanagermodule = require("./webhook-subscription-manager.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WebhookSubscriptionModule = class WebhookSubscriptionModule {
};
WebhookSubscriptionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _webhooksubscriptionmanagermodule.WebhookSubscriptionManagerModule,
            _featureflagmodule.FeatureFlagModule,
            _metricsmodule.MetricsModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _connectedaccountentity.ConnectedAccountEntity,
                _messagechannelentity.MessageChannelEntity,
                _calendarchannelentity.CalendarChannelEntity
            ])
        ],
        providers: [
            _webhooksubscriptionstatusservice.WebhookSubscriptionStatusService,
            _webhooksubscriptionexceptionhandlerservice.WebhookSubscriptionExceptionHandlerService,
            _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService,
            _calendarwebhooksubscriptionservice.CalendarWebhookSubscriptionService,
            _webhooksubscriptionchanneldeletedlistener.WebhookSubscriptionChannelDeletedListener,
            _webhooksubscriptionrenewalcronjob.WebhookSubscriptionRenewalCronJob,
            _webhooksubscriptionrenewalcroncommand.WebhookSubscriptionRenewalCronCommand,
            _createwebhooksubscriptionjob.CreateWebhookSubscriptionJob,
            _renewwebhooksubscriptionjob.RenewWebhookSubscriptionJob,
            _createwebhooksubscriptionforconnectedaccountcommand.CreateWebhookSubscriptionForConnectedAccountCommand
        ],
        exports: [
            _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService,
            _calendarwebhooksubscriptionservice.CalendarWebhookSubscriptionService,
            _webhooksubscriptionrenewalcroncommand.WebhookSubscriptionRenewalCronCommand
        ]
    })
], WebhookSubscriptionModule);

//# sourceMappingURL=webhook-subscription.module.js.map