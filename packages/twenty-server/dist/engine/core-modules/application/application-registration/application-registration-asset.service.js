"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationRegistrationAssetService", {
    enumerable: true,
    get: function() {
        return ApplicationRegistrationAssetService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationregistrationentity = require("./application-registration.entity");
const _isstorableassetpathutil = require("./utils/is-storable-asset-path.util");
const _togalleryimagepathsutil = require("./utils/to-gallery-image-paths.util");
const _filestorageexception = require("../../file-storage/interfaces/file-storage-exception");
const _serverfilestorageservice = require("../../file-storage/services/server-file-storage.service");
const _preparefileforstorageorthrowutil = require("../../file-storage/utils/prepare-file-for-storage-or-throw.util");
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
let ApplicationRegistrationAssetService = class ApplicationRegistrationAssetService {
    async storeRegistrationAssets({ applicationRegistrationId, manifestApplication, readAsset, skipAlreadyStoredPaths = false }) {
        const logoPath = manifestApplication?.logo ?? manifestApplication?.logoUrl;
        const logoFileId = (0, _utils.isDefined)(logoPath) ? await this.storeAssetFile({
            applicationRegistrationId,
            path: logoPath,
            readAsset,
            skipAlreadyStoredPaths
        }) : null;
        const galleryImages = [];
        for (const path of (0, _togalleryimagepathsutil.toGalleryImagePaths)(manifestApplication)){
            const fileId = await this.storeAssetFile({
                applicationRegistrationId,
                path,
                readAsset,
                skipAlreadyStoredPaths
            });
            // Entries without a fileId (absolute URLs, missing files) are kept so
            // the query-time URL resolution can still fall back on the raw path.
            galleryImages.push({
                path,
                fileId
            });
        }
        await this.applicationRegistrationRepository.update(applicationRegistrationId, {
            logoFileId,
            galleryImages
        });
    }
    async storeAssetFile({ applicationRegistrationId, path, readAsset, skipAlreadyStoredPaths }) {
        if (!(0, _isstorableassetpathutil.isStorableAssetPath)(path)) {
            return null;
        }
        if (skipAlreadyStoredPaths) {
            const alreadyStoredFileId = await this.findStoredAssetFileId({
                applicationRegistrationId,
                path
            });
            if ((0, _utils.isDefined)(alreadyStoredFileId)) {
                return alreadyStoredFileId;
            }
        }
        try {
            const contents = await readAsset(path);
            if (!(0, _utils.isDefined)(contents)) {
                return this.keepPreviouslyStoredAssetFileId({
                    applicationRegistrationId,
                    path
                });
            }
            const { sourceFile, mimeType } = await (0, _preparefileforstorageorthrowutil.prepareFileForStorageOrThrow)({
                sourceFile: contents,
                resourcePath: path
            });
            const savedFile = await this.serverFileStorageService.writeServerFile({
                fileFolder: _types.ServerFileFolder.ApplicationRegistration,
                applicationRegistrationId,
                resourcePath: path,
                contents: Buffer.isBuffer(sourceFile) ? sourceFile : Buffer.from(sourceFile),
                mimeType
            });
            return savedFile.id;
        } catch (error) {
            this.logger.warn(`Failed to store asset "${path}" for registration ${applicationRegistrationId}: ${error.message}`);
            return this.keepPreviouslyStoredAssetFileId({
                applicationRegistrationId,
                path
            });
        }
    }
    // A transient read/download failure must not clobber a working asset: the
    // file previously stored for the same path is kept. When the path changed,
    // no file exists for it and the asset correctly resolves to null.
    async keepPreviouslyStoredAssetFileId({ applicationRegistrationId, path }) {
        const previouslyStoredFileId = await this.findStoredAssetFileId({
            applicationRegistrationId,
            path
        });
        if ((0, _utils.isDefined)(previouslyStoredFileId)) {
            this.logger.warn(`Keeping previously stored file for asset "${path}" of registration ${applicationRegistrationId}`);
        }
        return previouslyStoredFileId;
    }
    async findStoredAssetFileId({ applicationRegistrationId, path }) {
        try {
            const storedFile = await this.serverFileStorageService.findServerFile({
                fileFolder: _types.ServerFileFolder.ApplicationRegistration,
                applicationRegistrationId,
                resourcePath: path
            });
            return storedFile?.id ?? null;
        } catch (error) {
            // Only an invalid path means "nothing stored for this path"; transient
            // lookup failures must propagate so a working fileId is never cleared.
            if (error instanceof _filestorageexception.FileStorageException) {
                return null;
            }
            throw error;
        }
    }
    constructor(applicationRegistrationRepository, serverFileStorageService){
        this.applicationRegistrationRepository = applicationRegistrationRepository;
        this.serverFileStorageService = serverFileStorageService;
        this.logger = new _common.Logger(ApplicationRegistrationAssetService.name);
    }
};
ApplicationRegistrationAssetService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _serverfilestorageservice.ServerFileStorageService === "undefined" ? Object : _serverfilestorageservice.ServerFileStorageService
    ])
], ApplicationRegistrationAssetService);

//# sourceMappingURL=application-registration-asset.service.js.map