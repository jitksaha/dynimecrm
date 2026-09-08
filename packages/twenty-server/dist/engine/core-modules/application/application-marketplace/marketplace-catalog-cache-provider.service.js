"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceCatalogCacheProviderService", {
    enumerable: true,
    get: function() {
        return MarketplaceCatalogCacheProviderService;
    }
});
const _common = require("@nestjs/common");
const _coreentitycachedecorator = require("../../../core-entity-cache/decorators/core-entity-cache.decorator");
const _coreentitycacheproviderservice = require("../../../core-entity-cache/interfaces/core-entity-cache-provider.service");
const _applicationregistrationvariableservice = require("../application-registration-variable/application-registration-variable.service");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MarketplaceCatalogCacheProviderService = class MarketplaceCatalogCacheProviderService extends _coreentitycacheproviderservice.CoreEntityCacheProvider {
    async computeForCache() {
        const registrations = await this.applicationRegistrationService.findManyListedCatalogCards();
        if (registrations.length === 0) {
            return {};
        }
        const configuredStatuses = await this.applicationRegistrationVariableService.isConfiguredBatch(registrations.map((registration)=>registration.id));
        return registrations.filter((registration)=>configuredStatuses.get(registration.id) ?? true).reduce((accumulator, registration)=>{
            accumulator[registration.universalIdentifier] = this.toMarketplaceAppDTO(registration);
            return accumulator;
        }, {});
    }
    toMarketplaceAppDTO(catalogCard) {
        return {
            id: catalogCard.universalIdentifier,
            name: catalogCard.name,
            description: catalogCard.description ?? '',
            author: catalogCard.author ?? 'Unknown',
            category: catalogCard.category ?? '',
            logoUrl: catalogCard.logoUrl ?? undefined,
            sourcePackage: catalogCard.sourcePackage ?? undefined,
            isVetted: catalogCard.isVetted
        };
    }
    constructor(applicationRegistrationService, applicationRegistrationVariableService){
        super(), this.applicationRegistrationService = applicationRegistrationService, this.applicationRegistrationVariableService = applicationRegistrationVariableService;
    }
};
MarketplaceCatalogCacheProviderService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _coreentitycachedecorator.CoreEntityCache)('marketplaceCatalog'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationregistrationvariableservice.ApplicationRegistrationVariableService === "undefined" ? Object : _applicationregistrationvariableservice.ApplicationRegistrationVariableService
    ])
], MarketplaceCatalogCacheProviderService);

//# sourceMappingURL=marketplace-catalog-cache-provider.service.js.map