"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ServerRouteTriggerController", {
    enumerable: true,
    get: function() {
        return ServerRouteTriggerController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _types = require("twenty-shared/types");
const _routetriggerresponseutil = require("../logic-function/logic-function-trigger/triggers/route/utils/route-trigger-response.util");
const _serverroutetriggerrestapiexceptionfilter = require("./exceptions/server-route-trigger-rest-api-exception-filter");
const _serverroutetriggerservice = require("./server-route-trigger.service");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _publicendpointguard = require("../../guards/public-endpoint.guard");
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
let ServerRouteTriggerController = class ServerRouteTriggerController {
    async handleRequest(resolverLogicFunctionUniversalIdentifier, request, response) {
        (0, _routetriggerresponseutil.sendRouteTriggerResponse)(response, await this.serverRouteTriggerService.handle({
            request,
            resolverLogicFunctionUniversalIdentifier
        }));
    }
    async get(resolverLogicFunctionUniversalIdentifier, request, response) {
        await this.handleRequest(resolverLogicFunctionUniversalIdentifier, request, response);
    }
    async post(resolverLogicFunctionUniversalIdentifier, request, response) {
        await this.handleRequest(resolverLogicFunctionUniversalIdentifier, request, response);
    }
    constructor(serverRouteTriggerService){
        this.serverRouteTriggerService = serverRouteTriggerService;
    }
};
_ts_decorate([
    (0, _common.Get)(':resolverLogicFunctionUniversalIdentifier'),
    _ts_param(0, (0, _common.Param)('resolverLogicFunctionUniversalIdentifier')),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ServerRouteTriggerController.prototype, "get", null);
_ts_decorate([
    (0, _common.Post)(':resolverLogicFunctionUniversalIdentifier'),
    _ts_param(0, (0, _common.Param)('resolverLogicFunctionUniversalIdentifier')),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ServerRouteTriggerController.prototype, "post", null);
ServerRouteTriggerController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Webhooks}/server`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.UseFilters)(_serverroutetriggerrestapiexceptionfilter.ServerRouteTriggerRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _serverroutetriggerservice.ServerRouteTriggerService === "undefined" ? Object : _serverroutetriggerservice.ServerRouteTriggerService
    ])
], ServerRouteTriggerController);

//# sourceMappingURL=server-route-trigger.controller.js.map