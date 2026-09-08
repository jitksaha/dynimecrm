"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplacePublicResolver", {
    enumerable: true,
    get: function() {
        return MarketplacePublicResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationregistrationexceptionfilter = require("../application-registration/application-registration-exception-filter");
const _applicationregistrationexception = require("../application-registration/application-registration.exception");
const _marketplaceappdto = require("./dtos/marketplace-app.dto");
const _marketplaceappdetaildto = require("./dtos/marketplace-app-detail.dto");
const _marketplacequeryservice = require("./marketplace-query.service");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _publicendpointguard = require("../../../guards/public-endpoint.guard");
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
let MarketplacePublicResolver = class MarketplacePublicResolver {
    async findManyPublicMarketplaceApps(isVetted) {
        return this.marketplaceQueryService.findManyMarketplaceApps({
            isVetted
        });
    }
    async findPublicMarketplaceAppDetail(universalIdentifier) {
        const detail = await this.marketplaceQueryService.findMarketplaceAppDetail(universalIdentifier);
        if (!detail.isListed) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`No listed marketplace application found for identifier "${universalIdentifier}"`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
        return detail;
    }
    constructor(marketplaceQueryService){
        this.marketplaceQueryService = marketplaceQueryService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _marketplaceappdto.MarketplaceAppDTO
        ], {
        name: 'publicMarketplaceApps'
    }),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('isVetted', {
        type: ()=>Boolean,
        defaultValue: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], MarketplacePublicResolver.prototype, "findManyPublicMarketplaceApps", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_marketplaceappdetaildto.MarketplaceAppDetailDTO, {
        name: 'publicMarketplaceAppDetail'
    }),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _graphql.Args)('universalIdentifier')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MarketplacePublicResolver.prototype, "findPublicMarketplaceAppDetail", null);
MarketplacePublicResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_applicationregistrationexceptionfilter.ApplicationRegistrationExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _marketplacequeryservice.MarketplaceQueryService === "undefined" ? Object : _marketplacequeryservice.MarketplaceQueryService
    ])
], MarketplacePublicResolver);

//# sourceMappingURL=marketplace-public.resolver.js.map