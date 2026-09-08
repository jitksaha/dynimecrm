"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouteTriggerController", {
    enumerable: true,
    get: function() {
        return RouteTriggerController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _types = require("twenty-shared/types");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _publicendpointguard = require("../../guards/public-endpoint.guard");
const _routetriggerrestapiexceptionfilter = require("../../core-modules/logic-function/logic-function-trigger/triggers/route/exceptions/route-trigger-rest-api-exception-filter");
const _routetriggerservice = require("../../core-modules/logic-function/logic-function-trigger/triggers/route/route-trigger.service");
const _routetriggerresponseutil = require("../../core-modules/logic-function/logic-function-trigger/triggers/route/utils/route-trigger-response.util");
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
let RouteTriggerController = class RouteTriggerController {
    async handleRequest(request, response, httpMethod) {
        const { response: triggerResponse, isIsolatedOrigin } = await this.routeTriggerService.handle({
            request,
            httpMethod
        });
        (0, _routetriggerresponseutil.sendRouteTriggerResponse)(response, triggerResponse, {
            allowAllHeaders: isIsolatedOrigin
        });
    }
    async get(request, response) {
        await this.handleRequest(request, response, _types.HTTPMethod.GET);
    }
    async post(request, response) {
        await this.handleRequest(request, response, _types.HTTPMethod.POST);
    }
    async put(request, response) {
        await this.handleRequest(request, response, _types.HTTPMethod.PUT);
    }
    async patch(request, response) {
        await this.handleRequest(request, response, _types.HTTPMethod.PATCH);
    }
    async delete(request, response) {
        await this.handleRequest(request, response, _types.HTTPMethod.DELETE);
    }
    constructor(routeTriggerService){
        this.routeTriggerService = routeTriggerService;
    }
};
_ts_decorate([
    (0, _common.Get)('*path'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RouteTriggerController.prototype, "get", null);
_ts_decorate([
    (0, _common.Post)('*path'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RouteTriggerController.prototype, "post", null);
_ts_decorate([
    (0, _common.Put)('*path'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RouteTriggerController.prototype, "put", null);
_ts_decorate([
    (0, _common.Patch)('*path'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RouteTriggerController.prototype, "patch", null);
_ts_decorate([
    (0, _common.Delete)('*path'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RouteTriggerController.prototype, "delete", null);
RouteTriggerController = _ts_decorate([
    (0, _common.Controller)(_types.ApiPath.RouteTrigger),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.UseFilters)(_routetriggerrestapiexceptionfilter.RouteTriggerRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _routetriggerservice.RouteTriggerService === "undefined" ? Object : _routetriggerservice.RouteTriggerService
    ])
], RouteTriggerController);

//# sourceMappingURL=route-trigger.controller.js.map