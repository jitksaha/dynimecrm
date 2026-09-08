"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountSyncWebhooksController", {
    enumerable: true,
    get: function() {
        return ConnectedAccountSyncWebhooksController;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _escapehtmlutil = require("../../engine/core-modules/emailing-domain/utils/escape-html.util");
const _nopermissionguard = require("../../engine/guards/no-permission.guard");
const _publicendpointguard = require("../../engine/guards/public-endpoint.guard");
const _googlecalendarnotificationhandler = require("./drivers/google/google-calendar-notification.handler");
const _googlemessagingnotificationhandler = require("./drivers/google/google-messaging-notification.handler");
const _microsoftcalendarnotificationhandler = require("./drivers/microsoft/microsoft-calendar-notification.handler");
const _microsoftmessagingnotificationhandler = require("./drivers/microsoft/microsoft-messaging-notification.handler");
const _connectedaccountsyncwebhookapiexceptionfilter = require("./filters/connected-account-sync-webhook-api-exception.filter");
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
let ConnectedAccountSyncWebhooksController = class ConnectedAccountSyncWebhooksController {
    async handleGoogleMessaging(body, authorizationHeader) {
        await this.googleMessagingNotificationHandler.handle({
            body,
            authorizationHeader
        });
    }
    async handleGoogleCalendar(channelId, resourceState, channelToken) {
        await this.googleCalendarNotificationHandler.handle({
            channelId,
            resourceState,
            channelToken
        });
    }
    async handleMicrosoftMessaging(body, validationToken, response) {
        if ((0, _utils.isDefined)(validationToken)) {
            return this.respondToValidationHandshake(validationToken, response);
        }
        await this.microsoftMessagingNotificationHandler.handle(body.value ?? []);
        return '';
    }
    async handleMicrosoftCalendar(body, validationToken, response) {
        if ((0, _utils.isDefined)(validationToken)) {
            return this.respondToValidationHandshake(validationToken, response);
        }
        await this.microsoftCalendarNotificationHandler.handle(body.value ?? []);
        return '';
    }
    respondToValidationHandshake(validationToken, response) {
        response.type('text/plain');
        return (0, _escapehtmlutil.escapeHtml)(validationToken);
    }
    constructor(googleMessagingNotificationHandler, googleCalendarNotificationHandler, microsoftMessagingNotificationHandler, microsoftCalendarNotificationHandler){
        this.googleMessagingNotificationHandler = googleMessagingNotificationHandler;
        this.googleCalendarNotificationHandler = googleCalendarNotificationHandler;
        this.microsoftMessagingNotificationHandler = microsoftMessagingNotificationHandler;
        this.microsoftCalendarNotificationHandler = microsoftCalendarNotificationHandler;
    }
};
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/google/messaging`),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Headers)('authorization')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof GooglePubSubPushMessage === "undefined" ? Object : GooglePubSubPushMessage,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountSyncWebhooksController.prototype, "handleGoogleMessaging", null);
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/google/calendar`),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Headers)('x-goog-channel-id')),
    _ts_param(1, (0, _common.Headers)('x-goog-resource-state')),
    _ts_param(2, (0, _common.Headers)('x-goog-channel-token')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountSyncWebhooksController.prototype, "handleGoogleCalendar", null);
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/microsoft/messaging`),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Query)('validationToken')),
    _ts_param(2, (0, _common.Res)({
        passthrough: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof MicrosoftGraphNotificationPayload === "undefined" ? Object : MicrosoftGraphNotificationPayload,
        Object,
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountSyncWebhooksController.prototype, "handleMicrosoftMessaging", null);
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/microsoft/calendar`),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Query)('validationToken')),
    _ts_param(2, (0, _common.Res)({
        passthrough: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof MicrosoftGraphNotificationPayload === "undefined" ? Object : MicrosoftGraphNotificationPayload,
        Object,
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountSyncWebhooksController.prototype, "handleMicrosoftCalendar", null);
ConnectedAccountSyncWebhooksController = _ts_decorate([
    (0, _common.Controller)(),
    (0, _common.UseFilters)(_connectedaccountsyncwebhookapiexceptionfilter.ConnectedAccountSyncWebhookApiExceptionFilter),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googlemessagingnotificationhandler.GoogleMessagingNotificationHandler === "undefined" ? Object : _googlemessagingnotificationhandler.GoogleMessagingNotificationHandler,
        typeof _googlecalendarnotificationhandler.GoogleCalendarNotificationHandler === "undefined" ? Object : _googlecalendarnotificationhandler.GoogleCalendarNotificationHandler,
        typeof _microsoftmessagingnotificationhandler.MicrosoftMessagingNotificationHandler === "undefined" ? Object : _microsoftmessagingnotificationhandler.MicrosoftMessagingNotificationHandler,
        typeof _microsoftcalendarnotificationhandler.MicrosoftCalendarNotificationHandler === "undefined" ? Object : _microsoftcalendarnotificationhandler.MicrosoftCalendarNotificationHandler
    ])
], ConnectedAccountSyncWebhooksController);

//# sourceMappingURL=connected-account-sync-webhooks.controller.js.map