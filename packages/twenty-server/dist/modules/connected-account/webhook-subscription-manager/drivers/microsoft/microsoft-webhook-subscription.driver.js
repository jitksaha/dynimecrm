"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftWebhookSubscriptionDriver", {
    enumerable: true,
    get: function() {
        return MicrosoftWebhookSubscriptionDriver;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _twentyconfigservice = require("../../../../../engine/core-modules/twenty-config/twenty-config.service");
const _microsoftsubscriptionttlmsconstant = require("./constants/microsoft-subscription-ttl-ms.constant");
const _webhooksubscriptiondriverexception = require("../exceptions/webhook-subscription-driver.exception");
const _microsoftoauth2clientprovider = require("../../../oauth2-client-manager/drivers/microsoft/microsoft-oauth2-client.provider");
const _parsemicrosoftwebhooksubscriptionerrorutil = require("./utils/parse-microsoft-webhook-subscription-error.util");
const _microsoftsubscriptionttlmsbufferconstant = require("./constants/microsoft-subscription-ttl-ms-buffer.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const MICROSOFT_GRAPH_RESOURCE_CONFIG_BY_CHANNEL_TYPE = {
    [_types.WebhookSubscriptionChannelType.MESSAGING]: {
        resource: '/me/messages',
        changeType: 'created,updated',
        notificationPath: `${_types.ApiPath.Webhooks}/microsoft/messaging`
    },
    [_types.WebhookSubscriptionChannelType.CALENDAR]: {
        resource: '/me/events',
        changeType: 'created,updated,deleted',
        notificationPath: `${_types.ApiPath.Webhooks}/microsoft/calendar`
    }
};
let MicrosoftWebhookSubscriptionDriver = class MicrosoftWebhookSubscriptionDriver {
    async createSubscription(connectedAccountId, channelType, clientState) {
        const resourceConfig = MICROSOFT_GRAPH_RESOURCE_CONFIG_BY_CHANNEL_TYPE[channelType];
        const graphClient = await this.microsoftOAuth2ClientProvider.getClient(connectedAccountId);
        const notificationUrl = `${this.twentyConfigService.get('SERVER_URL')}/${resourceConfig.notificationPath}`;
        const SUBSCRIPTION_TTL_MS = _microsoftsubscriptionttlmsconstant.MICROSOFT_SUBSCRIPTION_TTL_MS - _microsoftsubscriptionttlmsbufferconstant.MICROSOFT_SUBSCRIPTION_TTL_BUFFER_MS;
        const subscriptionPayload = {
            changeType: resourceConfig.changeType,
            notificationUrl,
            lifecycleNotificationUrl: notificationUrl,
            resource: resourceConfig.resource,
            expirationDateTime: new Date(Date.now() + SUBSCRIPTION_TTL_MS).toISOString(),
            clientState
        };
        const subscription = await graphClient.api('/subscriptions').post(subscriptionPayload).catch((error)=>{
            throw (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)(error, {
                cause: error
            });
        });
        return this.toResult(subscription);
    }
    async renewSubscription(context) {
        const graphClient = await this.microsoftOAuth2ClientProvider.getClient(context.connectedAccountId);
        const SUBSCRIPTION_TTL_MS = _microsoftsubscriptionttlmsconstant.MICROSOFT_SUBSCRIPTION_TTL_MS - _microsoftsubscriptionttlmsbufferconstant.MICROSOFT_SUBSCRIPTION_TTL_BUFFER_MS;
        const subscriptionPatch = {
            expirationDateTime: new Date(Date.now() + SUBSCRIPTION_TTL_MS).toISOString()
        };
        const renewedSubscription = await graphClient.api(`/subscriptions/${context.externalSubscriptionId}`).patch(subscriptionPatch).catch((error)=>{
            throw (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)(error, {
                cause: error
            });
        });
        return this.toResult(renewedSubscription);
    }
    async deleteSubscription(context) {
        if (!(0, _utils.isDefined)(context.externalSubscriptionId)) {
            return;
        }
        const graphClient = await this.microsoftOAuth2ClientProvider.getClient(context.connectedAccountId);
        await graphClient.api(`/subscriptions/${context.externalSubscriptionId}`).delete().catch((error)=>{
            throw (0, _parsemicrosoftwebhooksubscriptionerrorutil.parseMicrosoftWebhookSubscriptionError)(error, {
                cause: error
            });
        });
    }
    toResult(subscription) {
        if (!(0, _utils.isDefined)(subscription.id) || !(0, _utils.isDefined)(subscription.expirationDateTime)) {
            throw new _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException('Microsoft Graph subscription response did not include an id or expiration', _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.PROVIDER_RESPONSE_INVALID);
        }
        return {
            externalSubscriptionId: subscription.id,
            externalResourceId: null,
            expiresAt: new Date(subscription.expirationDateTime)
        };
    }
    constructor(microsoftOAuth2ClientProvider, twentyConfigService){
        this.microsoftOAuth2ClientProvider = microsoftOAuth2ClientProvider;
        this.twentyConfigService = twentyConfigService;
    }
};
MicrosoftWebhookSubscriptionDriver = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider === "undefined" ? Object : _microsoftoauth2clientprovider.MicrosoftOAuth2ClientProvider,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], MicrosoftWebhookSubscriptionDriver);

//# sourceMappingURL=microsoft-webhook-subscription.driver.js.map