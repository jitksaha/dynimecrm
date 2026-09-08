"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceCatalogSyncService", {
    enumerable: true,
    get: function() {
        return MarketplaceCatalogSyncService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _marketplaceservice = require("./marketplace.service");
const _applicationregistrationassetservice = require("../application-registration/application-registration-asset.service");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _areregistrationassetsstoredutil = require("../application-registration/utils/are-registration-assets-stored.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MarketplaceCatalogSyncService = class MarketplaceCatalogSyncService {
    async syncCatalog() {
        await this.syncRegistryApps();
        this.logger.log('Marketplace catalog sync completed');
    }
    async syncRegistryApps() {
        const packages = await this.marketplaceService.fetchAppsFromRegistry();
        this.logger.log(`${packages.length} packages detected`);
        for (const pkg of packages){
            this.logger.log(`Synchronizing ${pkg.name}...`);
            try {
                const fetchedManifest = await this.marketplaceService.fetchManifestFromRegistryCdn(pkg.name, pkg.version);
                if (!fetchedManifest) {
                    this.logger.debug(`Skipping ${pkg.name}: no manifest found on CDN`);
                    continue;
                }
                const universalIdentifier = fetchedManifest.application.universalIdentifier;
                const previousVersion = (await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier))?.latestAvailableVersion;
                await this.applicationRegistrationService.upsertFromCatalog({
                    universalIdentifier,
                    name: fetchedManifest.application.displayName ?? pkg.name,
                    sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
                    sourcePackage: pkg.name,
                    latestAvailableVersion: pkg.version ?? null,
                    manifest: fetchedManifest
                });
                const registration = await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier);
                if (!(0, _utils.isDefined)(registration)) {
                    continue;
                }
                // Rehost the logo and gallery images from the registry CDN so display
                // urls are served from fileIds like every other source. Skipped when
                // the version is unchanged and the files are already stored; the
                // query-time url builder falls back to CDN urls until they are. On an
                // unchanged version, only assets missing a stored file are fetched.
                if (previousVersion !== pkg.version || !(0, _areregistrationassetsstoredutil.areRegistrationAssetsStored)(registration, fetchedManifest.application)) {
                    await this.applicationRegistrationAssetService.storeRegistrationAssets({
                        applicationRegistrationId: registration.id,
                        manifestApplication: fetchedManifest.application,
                        readAsset: (path)=>this.marketplaceService.fetchAssetFromRegistryCdn(pkg.name, pkg.version, path),
                        skipAlreadyStoredPaths: previousVersion === pkg.version
                    });
                }
            } catch (error) {
                this.logger.error(`Failed to sync registry app "${pkg.name}": ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    constructor(applicationRegistrationService, applicationRegistrationAssetService, marketplaceService){
        this.applicationRegistrationService = applicationRegistrationService;
        this.applicationRegistrationAssetService = applicationRegistrationAssetService;
        this.marketplaceService = marketplaceService;
        this.logger = new _common.Logger(MarketplaceCatalogSyncService.name);
    }
};
MarketplaceCatalogSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationregistrationassetservice.ApplicationRegistrationAssetService === "undefined" ? Object : _applicationregistrationassetservice.ApplicationRegistrationAssetService,
        typeof _marketplaceservice.MarketplaceService === "undefined" ? Object : _marketplaceservice.MarketplaceService
    ])
], MarketplaceCatalogSyncService);

//# sourceMappingURL=marketplace-catalog-sync.service.js.map