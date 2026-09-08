"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceQueryService", {
    enumerable: true,
    get: function() {
        return MarketplaceQueryService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _coreentitycacheservice = require("../../../core-entity-cache/services/core-entity-cache.service");
const _marketplaceappscacheconstant = require("./constants/marketplace-apps-cache.constant");
const _applicationregistrationasseturlservice = require("../application-registration/application-registration-asset-url.service");
const _applicationregistrationexception = require("../application-registration/application-registration.exception");
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
let MarketplaceQueryService = class MarketplaceQueryService {
    async findManyMarketplaceApps({ universalIdentifiers, isVetted } = {}) {
        const appsByUniversalIdentifier = await this.coreEntityCacheService.get('marketplaceCatalog', _marketplaceappscacheconstant.MARKETPLACE_CATALOG_CACHE_ENTITY_ID) ?? {};
        const apps = (0, _utils.isNonEmptyArray)(universalIdentifiers) ? universalIdentifiers.map((universalIdentifier)=>appsByUniversalIdentifier[universalIdentifier]).filter(_utils.isDefined) : Object.values(appsByUniversalIdentifier);
        if (!(0, _utils.isDefined)(isVetted)) {
            return apps;
        }
        return apps.filter((app)=>app.isVetted === isVetted);
    }
    async findMarketplaceAppDetail(universalIdentifier) {
        const registration = await this.findRegistrationByUniversalIdentifier(universalIdentifier);
        return this.toMarketplaceAppDetailDTO(registration);
    }
    async findRegistrationByUniversalIdentifier(universalIdentifier) {
        const registration = await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier);
        if (!(0, _utils.isDefined)(registration)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`No application registration found for identifier "${universalIdentifier}"`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
        return registration;
    }
    toMarketplaceAppDetailDTO(registration) {
        const galleryImageUrls = this.applicationRegistrationAssetUrlService.buildGalleryImageUrls(registration);
        return {
            id: registration.id,
            universalIdentifier: registration.universalIdentifier,
            name: registration.name,
            sourceType: registration.sourceType,
            sourcePackage: registration.sourcePackage ?? undefined,
            latestAvailableVersion: registration.latestAvailableVersion ?? undefined,
            isListed: registration.isListed,
            isVetted: registration.isVetted,
            description: registration.description ?? registration.manifest?.application?.description ?? undefined,
            author: registration.author ?? registration.manifest?.application?.author ?? undefined,
            category: registration.category ?? registration.manifest?.application?.category ?? undefined,
            logoUrl: this.applicationRegistrationAssetUrlService.buildLogoUrl(registration) ?? undefined,
            websiteUrl: registration.websiteUrl ?? registration.manifest?.application?.websiteUrl ?? undefined,
            aboutDescription: registration.aboutDescription ?? registration.manifest?.application?.aboutDescription ?? undefined,
            termsUrl: registration.termsUrl ?? registration.manifest?.application?.termsUrl ?? undefined,
            emailSupport: registration.emailSupport ?? registration.manifest?.application?.emailSupport ?? undefined,
            issueReportUrl: registration.issueReportUrl ?? registration.manifest?.application?.issueReportUrl ?? undefined,
            screenshots: galleryImageUrls,
            galleryImages: galleryImageUrls,
            defaultRoleUniversalIdentifier: registration.manifest?.application?.defaultRoleUniversalIdentifier,
            roles: registration.manifest?.roles?.map((role)=>this.toMarketplaceAppRoleDTO(role)),
            manifest: registration.manifest ?? undefined
        };
    }
    toMarketplaceAppRoleDTO(role) {
        return {
            universalIdentifier: role.universalIdentifier,
            label: role.label,
            description: role.description,
            icon: role.icon,
            canUpdateAllSettings: role.canUpdateAllSettings,
            canAccessAllTools: role.canAccessAllTools,
            canReadAllObjectRecords: role.canReadAllObjectRecords,
            canUpdateAllObjectRecords: role.canUpdateAllObjectRecords,
            canSoftDeleteAllObjectRecords: role.canSoftDeleteAllObjectRecords,
            canDestroyAllObjectRecords: role.canDestroyAllObjectRecords,
            permissionFlagUniversalIdentifiers: role.permissionFlagUniversalIdentifiers,
            objectPermissions: role.objectPermissions?.map((permission)=>({
                    universalIdentifier: permission.universalIdentifier,
                    objectUniversalIdentifier: permission.objectUniversalIdentifier,
                    canReadObjectRecords: permission.canReadObjectRecords,
                    canUpdateObjectRecords: permission.canUpdateObjectRecords,
                    canSoftDeleteObjectRecords: permission.canSoftDeleteObjectRecords,
                    canDestroyObjectRecords: permission.canDestroyObjectRecords
                })),
            fieldPermissions: role.fieldPermissions?.map((permission)=>({
                    universalIdentifier: permission.universalIdentifier,
                    objectUniversalIdentifier: permission.objectUniversalIdentifier,
                    fieldUniversalIdentifier: permission.fieldUniversalIdentifier,
                    canReadFieldValue: permission.canReadFieldValue,
                    canUpdateFieldValue: permission.canUpdateFieldValue
                }))
        };
    }
    constructor(applicationRegistrationService, applicationRegistrationAssetUrlService, coreEntityCacheService){
        this.applicationRegistrationService = applicationRegistrationService;
        this.applicationRegistrationAssetUrlService = applicationRegistrationAssetUrlService;
        this.coreEntityCacheService = coreEntityCacheService;
    }
};
MarketplaceQueryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService === "undefined" ? Object : _applicationregistrationasseturlservice.ApplicationRegistrationAssetUrlService,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService
    ])
], MarketplaceQueryService);

//# sourceMappingURL=marketplace-query.service.js.map