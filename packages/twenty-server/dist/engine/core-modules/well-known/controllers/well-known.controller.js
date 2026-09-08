"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WellKnownController", {
    enumerable: true,
    get: function() {
        return WellKnownController;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _buildapicatalogutil = require("../utils/build-api-catalog.util");
const _buildmcpservercardutil = require("../utils/build-mcp-server-card.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _publicendpointguard = require("../../../guards/public-endpoint.guard");
const _getrequestbaseurlutil = require("../../../../utils/get-request-base-url.util");
const _extractversionmajorminorpatch = require("../../../../utils/version/extract-version-major-minor-patch");
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
const DISCOVERY_CACHE_CONTROL = 'public, max-age=3600';
const FALLBACK_SERVER_VERSION = '0.0.0';
let WellKnownController = class WellKnownController {
    getMcpServerCard(request) {
        const version = (0, _extractversionmajorminorpatch.extractVersionMajorMinorPatch)(this.twentyConfigService.get('APP_VERSION')) ?? FALLBACK_SERVER_VERSION;
        return (0, _buildmcpservercardutil.buildMcpServerCard)({
            baseUrl: (0, _getrequestbaseurlutil.getRequestBaseUrl)(request),
            version
        });
    }
    // Return a string so Nest keeps the explicit linkset+json Content-Type.
    getApiCatalog(request) {
        return JSON.stringify((0, _buildapicatalogutil.buildApiCatalog)((0, _getrequestbaseurlutil.getRequestBaseUrl)(request)), null, 2);
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
    }
};
_ts_decorate([
    (0, _common.Get)('mcp/server-card.json'),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.Header)('Cache-Control', DISCOVERY_CACHE_CONTROL),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", void 0)
], WellKnownController.prototype, "getMcpServerCard", null);
_ts_decorate([
    (0, _common.Get)('api-catalog'),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    (0, _common.Header)('Content-Type', 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'),
    (0, _common.Header)('Cache-Control', DISCOVERY_CACHE_CONTROL),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Request === "undefined" ? Object : Request
    ]),
    _ts_metadata("design:returntype", String)
], WellKnownController.prototype, "getApiCatalog", null);
WellKnownController = _ts_decorate([
    (0, _common.Controller)(_types.ApiPath.WellKnown),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], WellKnownController);

//# sourceMappingURL=well-known.controller.js.map