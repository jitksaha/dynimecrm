"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WebhookSubscriptionExceptionHandlerService", {
    enumerable: true,
    get: function() {
        return WebhookSubscriptionExceptionHandlerService;
    }
});
const _common = require("@nestjs/common");
const _exceptionhandlerservice = require("../../../../engine/core-modules/exception-handler/exception-handler.service");
const _connectedaccountrefreshtokensexception = require("../../../../engine/metadata-modules/connected-account/exceptions/connected-account-refresh-tokens.exception");
const _webhooksubscriptiondriverexception = require("../drivers/exceptions/webhook-subscription-driver.exception");
const _webhooksubscriptionstatusservice = require("./webhook-subscription-status.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WebhookSubscriptionExceptionHandlerService = class WebhookSubscriptionExceptionHandlerService {
    async handleDriverException(exception, operation, channelType, channel, workspaceId) {
        if (exception instanceof _webhooksubscriptiondriverexception.WebhookSubscriptionDriverException) {
            switch(exception.code){
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.NOT_FOUND:
                    return await this.handleNotFoundException(operation, channelType, channel, workspaceId);
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.INSUFFICIENT_PERMISSIONS:
                    return await this.handleInsufficientPermissionsException(channelType, channel);
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.TEMPORARY_ERROR:
                    return await this.handleTemporaryException(exception, channelType, channel);
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.PROVIDER_NOT_CONFIGURED:
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.PROVIDER_RESPONSE_INVALID:
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNSUPPORTED_PROVIDER:
                case _webhooksubscriptiondriverexception.WebhookSubscriptionDriverExceptionCode.UNKNOWN:
                default:
                    return await this.handleUnknownException(exception, channelType, channel, workspaceId);
            }
        }
        if (exception instanceof _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException) {
            switch(exception.code){
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.REFRESH_TOKEN_NOT_FOUND:
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN:
                    return await this.handleInsufficientPermissionsException(channelType, channel);
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR:
                    return await this.handleTemporaryException(exception, channelType, channel);
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.ACCESS_TOKEN_NOT_FOUND:
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.PROVIDER_NOT_SUPPORTED:
                default:
                    return await this.handleUnknownException(exception, channelType, channel, workspaceId);
            }
        }
        return await this.handleUnknownException(exception, channelType, channel, workspaceId);
    }
    async handleNotFoundException(operation, channelType, channel, workspaceId) {
        if (operation === 'CREATE') {
            return await this.handleInsufficientPermissionsException(channelType, channel);
        }
        const cleared = await this.webhookSubscriptionStatusService.clearRemovedSubscription(channelType, channel.id, workspaceId, channel.webhookSubscriptionExternalId);
        return cleared ? 'RECREATE' : 'NONE';
    }
    async handleInsufficientPermissionsException(channelType, channel) {
        await this.webhookSubscriptionStatusService.markAsExpired(channelType, channel.id);
        return 'NONE';
    }
    async handleTemporaryException(exception, channelType, channel) {
        await this.webhookSubscriptionStatusService.markAsFailed(channelType, channel.id);
        throw exception;
    }
    async handleUnknownException(exception, channelType, channel, workspaceId) {
        await this.webhookSubscriptionStatusService.markAsFailed(channelType, channel.id);
        this.exceptionHandlerService.captureExceptions([
            exception
        ], {
            workspace: {
                id: workspaceId
            }
        });
        throw exception;
    }
    constructor(webhookSubscriptionStatusService, exceptionHandlerService){
        this.webhookSubscriptionStatusService = webhookSubscriptionStatusService;
        this.exceptionHandlerService = exceptionHandlerService;
    }
};
WebhookSubscriptionExceptionHandlerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _webhooksubscriptionstatusservice.WebhookSubscriptionStatusService === "undefined" ? Object : _webhooksubscriptionstatusservice.WebhookSubscriptionStatusService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], WebhookSubscriptionExceptionHandlerService);

//# sourceMappingURL=webhook-subscription-exception-handler.service.js.map