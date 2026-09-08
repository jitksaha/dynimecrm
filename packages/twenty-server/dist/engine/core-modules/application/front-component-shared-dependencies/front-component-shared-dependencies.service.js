"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FrontComponentSharedDependenciesService", {
    enumerable: true,
    get: function() {
        return FrontComponentSharedDependenciesService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _filestorageservice = require("../../file-storage/services/file-storage.service");
const _getcontentdispositionutils = require("../../file/utils/get-content-disposition.utils");
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
const SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE = 'application/javascript';
let FrontComponentSharedDependenciesService = class FrontComponentSharedDependenciesService {
    async getBuiltSharedDependenciesPresignedUrlOrStream({ applicationId, workspaceId }) {
        const application = await this.applicationService.findOneApplicationOrThrow({
            id: applicationId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(application.frontComponentSharedDependenciesBuiltPath)) {
            throw new _applicationexception.ApplicationException(`Application "${applicationId}" does not declare shared dependencies`, _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND);
        }
        const resourceIdentifier = {
            workspaceId,
            applicationUniversalIdentifier: application.universalIdentifier,
            fileFolder: _types.FileFolder.BuiltFrontComponent,
            resourcePath: application.frontComponentSharedDependenciesBuiltPath
        };
        const presignedUrl = await this.fileStorageService.getPresignedUrl({
            ...resourceIdentifier,
            expiresInSeconds: this.twentyConfigService.get('STORAGE_S3_PRESIGNED_URL_EXPIRES_IN'),
            responseContentType: SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE,
            responseContentDisposition: (0, _getcontentdispositionutils.getContentDisposition)(SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE)
        });
        if ((0, _utils.isDefined)(presignedUrl)) {
            return {
                fileResponse: {
                    type: 'redirect',
                    presignedUrl
                },
                frontComponentSharedDependenciesChecksum: application.frontComponentSharedDependenciesChecksum
            };
        }
        const stream = await this.fileStorageService.readFile(resourceIdentifier);
        return {
            fileResponse: {
                type: 'stream',
                stream,
                mimeType: SHARED_DEPENDENCIES_BUNDLE_MIME_TYPE
            },
            frontComponentSharedDependenciesChecksum: application.frontComponentSharedDependenciesChecksum
        };
    }
    constructor(applicationService, fileStorageService, twentyConfigService){
        this.applicationService = applicationService;
        this.fileStorageService = fileStorageService;
        this.twentyConfigService = twentyConfigService;
    }
};
FrontComponentSharedDependenciesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], FrontComponentSharedDependenciesService);

//# sourceMappingURL=front-component-shared-dependencies.service.js.map