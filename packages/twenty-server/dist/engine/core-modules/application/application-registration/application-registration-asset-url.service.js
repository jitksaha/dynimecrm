"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationAssetUrlService", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationAssetUrlService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _buildregistrycdnurlutil = require("../application-marketplace/utils/build-registry-cdn-url.util");
const _applicationregistrationsourcetypeenum = require("./enums/application-registration-source-type.enum");
const _togalleryimagepathsutil = require("./utils/to-gallery-image-paths.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationRegistrationAssetUrlService = class ApplicationRegistrationAssetUrlService {
    buildLogoUrl(registration) {
        return this.resolveAssetUrl({
            fileId: registration.logoFileId,
            path: registration.logo,
            registration
        });
    }
    buildGalleryImageUrls(registration) {
        // TODO: read galleryImages only, once the deprecated screenshots column
        // and manifest fallback are backfilled away.
        const galleryImages = (0, _utils.isNonEmptyArray)(registration.galleryImages) ? registration.galleryImages : this.toGalleryImageFallbackEntries(registration);
        return galleryImages.map(({ path, fileId })=>this.resolveAssetUrl({
                fileId,
                path,
                registration
            })).filter(_utils.isDefined);
    }
    toGalleryImageFallbackEntries(registration) {
        const paths = (0, _utils.isNonEmptyArray)(registration.screenshots) ? registration.screenshots : (0, _togalleryimagepathsutil.toGalleryImagePaths)(registration.manifest?.application);
        return paths.map((path)=>({
                path,
                fileId: null
            }));
    }
    resolveAssetUrl({ fileId, path, registration }) {
        if (!(0, _utils.isDefined)(path) || path.length === 0) {
            return null;
        }
        // A fileId marks the path as stored in server file storage.
        if ((0, _utils.isDefined)(fileId)) {
            const serverUrl = this.twentyConfigService.get('SERVER_URL');
            // Encode segments so URL-reserved characters (#, ?, spaces) in file
            // names survive; directory separators are kept as route path segments.
            const encodedPath = path.split('/').map((segment)=>encodeURIComponent(segment)).join('/');
            return `${serverUrl}/files/application-registrations/${registration.id}/${encodedPath}`;
        }
        if ((0, _utils.isAbsoluteUrl)(path)) {
            return path;
        }
        if (registration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM && (0, _utils.isDefined)(registration.sourcePackage) && (0, _utils.isDefined)(registration.latestAvailableVersion)) {
            return (0, _buildregistrycdnurlutil.buildRegistryCdnUrl)({
                cdnBaseUrl: this.twentyConfigService.get('APP_REGISTRY_CDN_URL'),
                packageName: registration.sourcePackage,
                version: registration.latestAvailableVersion,
                filePath: path
            });
        }
        return null;
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
    }
};
ApplicationRegistrationAssetUrlService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], ApplicationRegistrationAssetUrlService);

//# sourceMappingURL=application-registration-asset-url.service.js.map