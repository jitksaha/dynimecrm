"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingWebhooksController", {
    enumerable: true,
    get: function() {
        return MessagingWebhooksController;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _nopermissionguard = require("../../engine/guards/no-permission.guard");
const _publicendpointguard = require("../../engine/guards/public-endpoint.guard");
const _resendwebhookdriverservice = require("./drivers/resend/services/resend-webhook-driver.service");
const _sesinboundwebhookdriverservice = require("./drivers/aws-ses/services/ses-inbound-webhook-driver.service");
const _sesoutboundwebhookdriverservice = require("./drivers/aws-ses/services/ses-outbound-webhook-driver.service");
const _messagingwebhookapiexceptionfilter = require("./filters/messaging-webhook-api-exception.filter");
const _messagingwebhookexceptioncodeenum = require("./messaging-webhook-exception-code.enum");
const _messagingwebhookexception = require("./messaging-webhook.exception");
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
let MessagingWebhooksController = class MessagingWebhooksController {
    async handleSesInboundWebhook(request) {
        if (!(0, _utils.isDefined)(request.rawBody)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Missing SNS payload', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_MISSING_REQUEST_BODY);
        }
        await this.sesInboundWebhookDriverService.handle(request.rawBody);
    }
    async handleSesOutboundWebhook(request) {
        if (!(0, _utils.isDefined)(request.rawBody)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Missing SNS payload', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_MISSING_REQUEST_BODY);
        }
        await this.sesOutboundWebhookDriverService.handle(request.rawBody);
    }
    async handleResendWebhook(request) {
        if (!(0, _utils.isDefined)(request.rawBody)) {
            throw new _messagingwebhookexception.MessagingWebhookException('Missing Resend payload', _messagingwebhookexceptioncodeenum.MessagingWebhookExceptionCode.MESSAGING_WEBHOOK_MISSING_REQUEST_BODY);
        }
        await this.resendWebhookDriverService.handle(request.rawBody, {
            svixId: this.getHeader(request, 'svix-id'),
            svixTimestamp: this.getHeader(request, 'svix-timestamp'),
            svixSignature: this.getHeader(request, 'svix-signature')
        });
    }
    getHeader(request, name) {
        const value = request.headers[name];
        return Array.isArray(value) ? value[0] : value;
    }
    constructor(sesInboundWebhookDriverService, sesOutboundWebhookDriverService, resendWebhookDriverService){
        this.sesInboundWebhookDriverService = sesInboundWebhookDriverService;
        this.sesOutboundWebhookDriverService = sesOutboundWebhookDriverService;
        this.resendWebhookDriverService = resendWebhookDriverService;
    }
};
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/messaging/ses/inbound`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RawBodyRequest === "undefined" ? Object : RawBodyRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingWebhooksController.prototype, "handleSesInboundWebhook", null);
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/messaging/ses/outbound`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RawBodyRequest === "undefined" ? Object : RawBodyRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingWebhooksController.prototype, "handleSesOutboundWebhook", null);
_ts_decorate([
    (0, _common.Post)(`${_types.ApiPath.Webhooks}/messaging/resend`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RawBodyRequest === "undefined" ? Object : RawBodyRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingWebhooksController.prototype, "handleResendWebhook", null);
MessagingWebhooksController = _ts_decorate([
    (0, _common.Controller)(),
    (0, _common.UseFilters)(_messagingwebhookapiexceptionfilter.MessagingWebhookApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _sesinboundwebhookdriverservice.SesInboundWebhookDriverService === "undefined" ? Object : _sesinboundwebhookdriverservice.SesInboundWebhookDriverService,
        typeof _sesoutboundwebhookdriverservice.SesOutboundWebhookDriverService === "undefined" ? Object : _sesoutboundwebhookdriverservice.SesOutboundWebhookDriverService,
        typeof _resendwebhookdriverservice.ResendWebhookDriverService === "undefined" ? Object : _resendwebhookdriverservice.ResendWebhookDriverService
    ])
], MessagingWebhooksController);

//# sourceMappingURL=messaging-webhooks.controller.js.map