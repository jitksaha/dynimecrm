"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerRouteTriggerRestApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return ServerRouteTriggerRestApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _httpexceptionhandlerservice = require("../../exception-handler/http-exception-handler.service");
const _serverroutetriggerexception = require("./server-route-trigger.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ServerRouteTriggerRestApiExceptionFilter = class ServerRouteTriggerRestApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        switch(exception.code){
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_NOT_FOUND:
                return this.httpExceptionHandlerService.handleError(exception, response, 404);
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.LOGIC_FUNCTION_DISABLED:
                return this.httpExceptionHandlerService.handleError(exception, response, 403, undefined, undefined, {
                    shouldBeCapturedBySentry: false
                });
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RATE_LIMIT_EXCEEDED:
                return this.httpExceptionHandlerService.handleError(exception, response, 429, undefined, undefined, {
                    shouldBeCapturedBySentry: false
                });
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.SERVER_ROUTE_USER_UNCAUGHT_ERROR:
                return this.httpExceptionHandlerService.handleError(exception, response, 500, undefined, undefined, {
                    shouldBeCapturedBySentry: false
                });
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.SERVER_ROUTE_PLATFORM_ERROR:
                return this.httpExceptionHandlerService.handleError(exception, response, 500);
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RESOLVER_INVALID_RESULT:
                return this.httpExceptionHandlerService.handleError(exception, response, 502, undefined, undefined, {
                    shouldBeCapturedBySentry: false
                });
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.RESOLVER_REQUIRES_AUTHENTICATION:
                return this.httpExceptionHandlerService.handleError(exception, response, 403, undefined, undefined, {
                    shouldBeCapturedBySentry: false
                });
            case _serverroutetriggerexception.ServerRouteTriggerExceptionCode.METHOD_NOT_ALLOWED:
                return this.httpExceptionHandlerService.handleError(exception, response, 405, undefined, undefined, {
                    shouldBeCapturedBySentry: false
                });
            default:
                {
                    return this.httpExceptionHandlerService.handleError(exception, response, 400);
                }
        }
    }
    constructor(httpExceptionHandlerService){
        this.httpExceptionHandlerService = httpExceptionHandlerService;
    }
};
ServerRouteTriggerRestApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_serverroutetriggerexception.ServerRouteTriggerException),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httpexceptionhandlerservice.HttpExceptionHandlerService === "undefined" ? Object : _httpexceptionhandlerservice.HttpExceptionHandlerService
    ])
], ServerRouteTriggerRestApiExceptionFilter);

//# sourceMappingURL=server-route-trigger-rest-api-exception-filter.js.map