"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationSummaryResolver", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationSummaryResolver;
    }
});
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationregistrationasseturlservice = require("./application-registration-asset-url.service");
const _applicationregistrationentity = require("./application-registration.entity");
const _applicationregistrationsummarydto = require("./dtos/application-registration-summary.dto");
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
let ApplicationRegistrationSummaryResolver = class ApplicationRegistrationSummaryResolver {
    logoUrl(registration) {
        return this.applicationRegistrationAssetUrlService.buildLogoUrl(registration);
    }
    constructor(applicationRegistrationAssetUrlService){
        this.applicationRegistrationAssetUrlService = applicationRegistrationAssetUrlService;
    }
};
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationentity.ApplicationRegistrationEntity === "undefined" ? Object : _applicationregistrationentity.ApplicationRegistrationEntity
    ]),
    _ts_metadata("design:returntype", Object)
], ApplicationRegistrationSummaryResolver.prototype, "logoUrl", null);
ApplicationRegistrationSummaryResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_applicationregistrationsummarydto.ApplicationRegistrationSummaryDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService === "undefined" ? Object : _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService
    ])
], ApplicationRegistrationSummaryResolver);

//# sourceMappingURL=application-registration-summary.resolver.js.map