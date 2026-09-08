"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleMessagingNotificationHandler", {
    enumerable: true,
    get: function() {
        return GoogleMessagingNotificationHandler;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _googleauthlibrary = require("google-auth-library");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _twentyconfigservice = require("../../../../engine/core-modules/twenty-config/twenty-config.service");
const _connectedaccountentity = require("../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _webhooksynctriggerservice = require("../../../connected-account/webhook-subscription-manager/services/webhook-sync-trigger.service");
const _connectedaccountsyncwebhookexception = require("../../connected-account-sync-webhook.exception");
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
let GoogleMessagingNotificationHandler = class GoogleMessagingNotificationHandler {
    async handle(request) {
        await this.verify(request.authorizationHeader);
        this.metricsService.incrementCounterBy({
            key: _metricskeystype.MetricsKeys.ConnectedAccountSyncWebhookReceivedMessaging,
            amount: 1
        });
        const decodedData = this.decodeMessageData(request.body);
        if (!(0, _utils.isDefined)(decodedData)) {
            return;
        }
        const connectedAccounts = await this.connectedAccountRepository.find({
            where: {
                handle: decodedData.emailAddress,
                provider: _types.ConnectedAccountProvider.GOOGLE
            }
        });
        const connectedAccountIds = connectedAccounts.map((connectedAccount)=>connectedAccount.id);
        if (connectedAccountIds.length === 0) {
            this.logger.warn('No Google connected account matches Gmail notification');
            return;
        }
        const messageChannels = await this.messageChannelRepository.find({
            where: {
                connectedAccountId: (0, _typeorm1.In)(connectedAccountIds),
                webhookSubscriptionStatus: _types.WebhookSubscriptionStatus.ACTIVE
            }
        });
        if (messageChannels.length === 0) {
            return;
        }
        for (const messageChannel of messageChannels){
            await this.webhookSyncTriggerService.triggerMessagingSync(messageChannel.id, messageChannel.workspaceId);
        }
        this.logger.log(`Triggered messaging sync for ${messageChannels.length} message channels from Gmail notification`);
    }
    async verify(authorizationHeader) {
        const expectedEmail = this.twentyConfigService.get('MESSAGING_GMAIL_PUBSUB_VERIFICATION_EMAIL');
        if (!(0, _guards.isNonEmptyString)(expectedEmail)) {
            throw new _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException('MESSAGING_GMAIL_PUBSUB_VERIFICATION_EMAIL is not configured', _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_SIGNATURE);
        }
        const idToken = authorizationHeader?.replace(/^Bearer\s+/i, '');
        if (!(0, _guards.isNonEmptyString)(idToken)) {
            throw new _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException('Missing Pub/Sub OIDC token', _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_SIGNATURE);
        }
        const expectedAudience = `${this.twentyConfigService.get('SERVER_URL')}/webhooks/google/messaging`;
        try {
            const ticket = await this.oauth2Client.verifyIdToken({
                idToken,
                audience: expectedAudience
            });
            const payload = ticket.getPayload();
            if (!(0, _utils.isDefined)(payload) || payload.email !== expectedEmail || payload.email_verified !== true) {
                throw new _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException('Pub/Sub OIDC token failed verification', _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_SIGNATURE);
            }
        } catch (error) {
            if (error instanceof _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException) {
                throw error;
            }
            throw new _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException('Pub/Sub OIDC token verification failed', _connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookExceptionCode.INVALID_SIGNATURE);
        }
    }
    decodeMessageData(body) {
        const encodedData = body.message?.data;
        if (!(0, _guards.isNonEmptyString)(encodedData)) {
            return;
        }
        const decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
        if (!(0, _guards.isNonEmptyString)(decoded.emailAddress)) {
            return;
        }
        return decoded;
    }
    constructor(twentyConfigService, metricsService, connectedAccountRepository, messageChannelRepository, webhookSyncTriggerService){
        this.twentyConfigService = twentyConfigService;
        this.metricsService = metricsService;
        this.connectedAccountRepository = connectedAccountRepository;
        this.messageChannelRepository = messageChannelRepository;
        this.webhookSyncTriggerService = webhookSyncTriggerService;
        this.logger = new _common.Logger(GoogleMessagingNotificationHandler.name);
        this.oauth2Client = new _googleauthlibrary.OAuth2Client();
    }
};
GoogleMessagingNotificationHandler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _webhooksynctriggerservice.WebhookSyncTriggerService === "undefined" ? Object : _webhooksynctriggerservice.WebhookSyncTriggerService
    ])
], GoogleMessagingNotificationHandler);

//# sourceMappingURL=google-messaging-notification.handler.js.map