"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleWebhookDriverModule", {
    enumerable: true,
    get: function() {
        return GoogleWebhookDriverModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _metricsmodule = require("../../../../engine/core-modules/metrics/metrics.module");
const _twentyconfigmodule = require("../../../../engine/core-modules/twenty-config/twenty-config.module");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _connectedaccountentity = require("../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _webhooksynctriggerservice = require("../../../connected-account/webhook-subscription-manager/services/webhook-sync-trigger.service");
const _webhooksubscriptionmodule = require("../../../connected-account/webhook-subscription-manager/webhook-subscription.module");
const _googlecalendarnotificationhandler = require("./google-calendar-notification.handler");
const _googlemessagingnotificationhandler = require("./google-messaging-notification.handler");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let GoogleWebhookDriverModule = class GoogleWebhookDriverModule {
};
GoogleWebhookDriverModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _metricsmodule.MetricsModule,
            _twentyconfigmodule.TwentyConfigModule,
            _webhooksubscriptionmodule.WebhookSubscriptionModule,
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity,
                _messagechannelentity.MessageChannelEntity,
                _calendarchannelentity.CalendarChannelEntity
            ])
        ],
        providers: [
            _googlemessagingnotificationhandler.GoogleMessagingNotificationHandler,
            _googlecalendarnotificationhandler.GoogleCalendarNotificationHandler,
            _webhooksynctriggerservice.WebhookSyncTriggerService
        ],
        exports: [
            _googlemessagingnotificationhandler.GoogleMessagingNotificationHandler,
            _googlecalendarnotificationhandler.GoogleCalendarNotificationHandler
        ]
    })
], GoogleWebhookDriverModule);

//# sourceMappingURL=google-webhook-driver.module.js.map