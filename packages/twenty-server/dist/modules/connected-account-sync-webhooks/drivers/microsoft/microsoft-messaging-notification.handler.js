"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftMessagingNotificationHandler", {
    enumerable: true,
    get: function() {
        return MicrosoftMessagingNotificationHandler;
    }
});
const _crypto = require("crypto");
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _messagingwebhooksubscriptionservice = require("../../../connected-account/webhook-subscription-manager/services/messaging-webhook-subscription.service");
const _webhooksynctriggerservice = require("../../../connected-account/webhook-subscription-manager/services/webhook-sync-trigger.service");
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
let MicrosoftMessagingNotificationHandler = class MicrosoftMessagingNotificationHandler {
    async handle(notifications) {
        if (notifications.length > 0) {
            this.metricsService.incrementCounterBy({
                key: _metricskeystype.MetricsKeys.ConnectedAccountSyncWebhookReceivedMessaging,
                amount: notifications.length
            });
        }
        const subscriptionIds = notifications.map((notification)=>notification.subscriptionId).filter(_guards.isNonEmptyString);
        if (subscriptionIds.length === 0) {
            return;
        }
        const messageChannels = await this.messageChannelRepository.find({
            where: {
                webhookSubscriptionExternalId: (0, _typeorm1.In)(subscriptionIds)
            }
        });
        const messageChannelByExternalId = new Map(messageChannels.map((messageChannel)=>[
                messageChannel.webhookSubscriptionExternalId,
                messageChannel
            ]));
        for (const notification of notifications){
            const messageChannel = messageChannelByExternalId.get(notification.subscriptionId);
            if (!(0, _utils.isDefined)(messageChannel)) {
                this.logger.warn(`No messaging subscription found for ${notification.subscriptionId}`);
                continue;
            }
            const clientState = notification.clientState;
            const expectedClientState = messageChannel.webhookSubscriptionClientState;
            const clientStateBuffer = (0, _guards.isNonEmptyString)(clientState) ? Buffer.from(clientState) : null;
            const expectedClientStateBuffer = (0, _guards.isNonEmptyString)(expectedClientState) ? Buffer.from(expectedClientState) : null;
            if (!(0, _utils.isDefined)(clientStateBuffer) || !(0, _utils.isDefined)(expectedClientStateBuffer) || clientStateBuffer.length !== expectedClientStateBuffer.length || !(0, _crypto.timingSafeEqual)(clientStateBuffer, expectedClientStateBuffer)) {
                this.logger.warn(`Client state mismatch for subscription ${notification.subscriptionId}`);
                continue;
            }
            if ((0, _guards.isNonEmptyString)(notification.lifecycleEvent)) {
                await this.handleLifecycleEvent({
                    lifecycleEvent: notification.lifecycleEvent,
                    removedSubscriptionId: notification.subscriptionId,
                    messageChannel
                }).catch((error)=>this.logger.error(`Failed to handle ${notification.lifecycleEvent} lifecycle event for message channel ${messageChannel.id}`, error));
                continue;
            }
            await this.webhookSyncTriggerService.triggerMessagingSync(messageChannel.id, messageChannel.workspaceId);
            this.logger.log(`Triggered messaging sync for message channel ${messageChannel.id} from Microsoft notification`);
        }
    }
    async handleLifecycleEvent({ lifecycleEvent, removedSubscriptionId, messageChannel }) {
        switch(lifecycleEvent){
            case 'subscriptionRemoved':
                await this.messagingWebhookSubscriptionService.recreateSubscription({
                    messageChannelId: messageChannel.id,
                    workspaceId: messageChannel.workspaceId,
                    removedSubscriptionId
                });
                await this.webhookSyncTriggerService.triggerMessagingSync(messageChannel.id, messageChannel.workspaceId);
                break;
            case 'reauthorizationRequired':
                await this.messagingWebhookSubscriptionService.renewSubscription({
                    messageChannelId: messageChannel.id,
                    workspaceId: messageChannel.workspaceId
                });
                break;
            case 'missed':
                await this.webhookSyncTriggerService.triggerMessagingSync(messageChannel.id, messageChannel.workspaceId);
                break;
            default:
                {
                    const unhandledLifecycleEvent = lifecycleEvent;
                    this.logger.warn(`Ignored unrecognized lifecycle event ${unhandledLifecycleEvent} for message channel ${messageChannel.id}`);
                }
        }
    }
    constructor(messageChannelRepository, messagingWebhookSubscriptionService, webhookSyncTriggerService, metricsService){
        this.messageChannelRepository = messageChannelRepository;
        this.messagingWebhookSubscriptionService = messagingWebhookSubscriptionService;
        this.webhookSyncTriggerService = webhookSyncTriggerService;
        this.metricsService = metricsService;
        this.logger = new _common.Logger(MicrosoftMessagingNotificationHandler.name);
    }
};
MicrosoftMessagingNotificationHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService === "undefined" ? Object : _messagingwebhooksubscriptionservice.MessagingWebhookSubscriptionService,
        typeof _webhooksynctriggerservice.WebhookSyncTriggerService === "undefined" ? Object : _webhooksynctriggerservice.WebhookSyncTriggerService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], MicrosoftMessagingNotificationHandler);

//# sourceMappingURL=microsoft-messaging-notification.handler.js.map