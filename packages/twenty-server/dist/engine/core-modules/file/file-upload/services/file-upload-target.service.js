"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileUploadTargetService", {
    enumerable: true,
    get: function() {
        return FileUploadTargetService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _filestorageservice = require("../../../file-storage/services/file-storage.service");
const _tobatcherrormessageutil = require("../utils/to-batch-error-message.util");
const _jwttokentypeenum = require("../../../auth/types/jwt-token-type.enum");
const _jwtwrapperservice = require("../../../jwt/services/jwt-wrapper.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const DIRECT_UPLOAD_CONTENT_TYPE = 'application/octet-stream';
let FileUploadTargetService = class FileUploadTargetService {
    async buildUploadTarget({ workspaceId, fileId, fileFolder, applicationUniversalIdentifier, resourcePath, contentType, size }) {
        const expiresInSeconds = this.twentyConfigService.get('STORAGE_S3_PRESIGNED_URL_EXPIRES_IN');
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
        const presignedUploadUrl = await this.fileStorageService.getPresignedUploadUrl({
            fileFolder,
            applicationUniversalIdentifier,
            workspaceId,
            resourcePath,
            contentType,
            contentLength: size,
            expiresInSeconds
        });
        if ((0, _utils.isDefined)(presignedUploadUrl)) {
            return {
                fileId,
                uploadUrl: presignedUploadUrl,
                contentType,
                expiresAt
            };
        }
        const payload = {
            workspaceId,
            fileId,
            sub: workspaceId,
            type: _jwttokentypeenum.JwtTokenTypeEnum.FILE_UPLOAD
        };
        const token = await this.jwtWrapperService.signAsyncOrThrow(payload, {
            expiresIn: expiresInSeconds
        });
        const serverUrl = this.twentyConfigService.get('SERVER_URL');
        return {
            fileId,
            uploadUrl: `${serverUrl}/${_types.ApiPath.FileUpload}/${fileId}?token=${token}`,
            contentType: DIRECT_UPLOAD_CONTENT_TYPE,
            expiresAt
        };
    }
    async createUploadTargetsBatch(requests) {
        return Promise.all(requests.map(async (request)=>{
            try {
                const pendingFile = await this.fileStorageService.createPendingFile({
                    fileFolder: request.fileFolder,
                    applicationUniversalIdentifier: request.applicationUniversalIdentifier,
                    applicationId: request.applicationId,
                    workspaceId: request.workspaceId,
                    resourcePath: request.resourcePath,
                    fileId: (0, _uuid.v4)(),
                    size: request.size,
                    mimeType: DIRECT_UPLOAD_CONTENT_TYPE,
                    settings: request.settings
                });
                const value = await this.buildUploadTarget({
                    workspaceId: request.workspaceId,
                    fileId: pendingFile.id,
                    fileFolder: request.fileFolder,
                    applicationUniversalIdentifier: request.applicationUniversalIdentifier,
                    resourcePath: request.resourcePath,
                    contentType: DIRECT_UPLOAD_CONTENT_TYPE,
                    size: request.size
                });
                return {
                    success: true,
                    value
                };
            } catch (error) {
                return {
                    success: false,
                    error: (0, _tobatcherrormessageutil.toBatchErrorMessage)(error)
                };
            }
        }));
    }
    constructor(fileStorageService, jwtWrapperService, twentyConfigService){
        this.fileStorageService = fileStorageService;
        this.jwtWrapperService = jwtWrapperService;
        this.twentyConfigService = twentyConfigService;
    }
};
FileUploadTargetService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], FileUploadTargetService);

//# sourceMappingURL=file-upload-target.service.js.map