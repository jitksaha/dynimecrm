"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountSyncWebhookApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return ConnectedAccountSyncWebhookApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _httpexceptionhandlerservice = require("../../../engine/core-modules/exception-handler/http-exception-handler.service");
const _connectedaccountsyncwebhookexception = require("../connected-account-sync-webhook.exception");
const _getconnectedaccountsyncwebhookexceptionstatuscodeutil = require("../utils/get-connected-account-sync-webhook-exception-status-code.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ConnectedAccountSyncWebhookApiExceptionFilter = class ConnectedAccountSyncWebhookApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        return this.httpExceptionHandlerService.handleError(exception, response, (0, _getconnectedaccountsyncwebhookexceptionstatuscodeutil.getConnectedAccountSyncWebhookExceptionStatusCode)(exception));
    }
    constructor(httpExceptionHandlerService){
        this.httpExceptionHandlerService = httpExceptionHandlerService;
    }
};
ConnectedAccountSyncWebhookApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_connectedaccountsyncwebhookexception.ConnectedAccountSyncWebhookException),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httpexceptionhandlerservice.HttpExceptionHandlerService === "undefined" ? Object : _httpexceptionhandlerservice.HttpExceptionHandlerService
    ])
], ConnectedAccountSyncWebhookApiExceptionFilter);

//# sourceMappingURL=connected-account-sync-webhook-api-exception.filter.js.map