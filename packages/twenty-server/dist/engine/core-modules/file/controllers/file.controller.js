"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileController", {
    enumerable: true,
    get: function() {
        return FileController;
    }
});
const _common = require("@nestjs/common");
const _promises = require("node:stream/promises");
const _path = require("path");
const _express = require("express");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _filestorageexception = require("../../file-storage/interfaces/file-storage-exception");
const _serverfilestorageservice = require("../../file-storage/services/server-file-storage.service");
const _validatefilepathutil = require("../../file-storage/utils/validate-file-path.util");
const _fileexception = require("../file.exception");
const _filefolderinterface = require("../interfaces/file-folder.interface");
const _fileapiexceptionfilter = require("../filters/file-api-exception.filter");
const _filebyidguard = require("../guards/file-by-id.guard");
const _fileservice = require("../services/file.service");
const _setfileresponseheadersutils = require("../utils/set-file-response-headers.utils");
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
let FileController = class FileController {
    // Serves application registration assets (logo, gallery images) by their
    // public folder path. These are instance-global marketplace resources, also
    // displayed on the public OAuth authorize page, hence no auth token, unlike
    // the workspace-scoped /file/:folder/:id.
    async getApplicationRegistrationAsset(res, req, applicationRegistrationId) {
        const filepath = (0, _path.join)(...req.params.path);
        let fileResponse;
        try {
            fileResponse = await this.serverFileStorageService.readServerFile({
                fileFolder: _types.ServerFileFolder.ApplicationRegistration,
                applicationRegistrationId,
                resourcePath: filepath
            });
        } catch (error) {
            if (error instanceof _filestorageexception.FileStorageException && (error.code === _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND || error.code === _filestorageexception.FileStorageExceptionCode.ACCESS_DENIED)) {
                throw new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND);
            }
            this.logger.error('readServerFile failed unexpectedly', {
                error
            });
            throw new _fileexception.FileException('Error retrieving file', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
        }
        (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, fileResponse.mimeType);
        res.setHeader('Cache-Control', _filefolderinterface.PUBLIC_ASSET_CACHE_CONTROL);
        try {
            await (0, _promises.pipeline)(fileResponse.stream, res);
        } catch (error) {
            fileResponse.stream.destroy();
            this.logger.error('Application registration file stream failed mid-transfer', {
                error
            });
            if (!res.headersSent) {
                throw new _fileexception.FileException('Error streaming file from storage', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
            }
            res.destroy();
        }
    }
    async getPublicAssets(res, req, workspaceId, applicationId) {
        const filepath = (0, _path.join)(...req.params.path);
        const filePathValidationResult = (0, _validatefilepathutil.validateFilePath)({
            resourcePath: filepath,
            fileFolder: _types.FileFolder.PublicAsset
        });
        if (!filePathValidationResult.isValid) {
            throw new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND);
        }
        const fileResponse = await this.fileService.getFilePresignedUrlOrStreamByPath({
            workspaceId,
            applicationId,
            fileFolder: _types.FileFolder.PublicAsset,
            filepath
        }).catch((error)=>{
            this.logger.error('getFilePresignedUrlOrStreamByPath failed unexpectedly', {
                error
            });
            throw new _fileexception.FileException('Error retrieving file', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
        });
        if (fileResponse === null) {
            throw new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND);
        }
        if (fileResponse.type === 'redirect') {
            return res.redirect(fileResponse.presignedUrl);
        }
        (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, fileResponse.mimeType, _types.FileFolder.PublicAsset);
        try {
            await (0, _promises.pipeline)(fileResponse.stream, res);
        } catch (error) {
            fileResponse.stream.destroy();
            this.logger.error('Public asset stream failed mid-transfer', {
                error
            });
            if (!res.headersSent) {
                throw new _fileexception.FileException('Error streaming file from storage', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
            }
            res.destroy();
        }
    }
    async getFileById(res, req, fileFolder, fileId) {
        const workspaceId = req.workspaceId;
        const fileResponse = await this.fileService.getFilePresignedUrlOrStreamById({
            fileId,
            workspaceId,
            fileFolder,
            rangeHeader: req.headers.range
        }).catch((error)=>{
            if (error instanceof _fileexception.FileException) {
                throw error;
            }
            this.logger.error('getFilePresignedUrlOrStreamById failed unexpectedly', {
                error
            });
            throw new _fileexception.FileException('Error retrieving file', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
        });
        if (fileResponse === null) {
            throw new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND);
        }
        if (fileResponse.type === 'redirect') {
            return res.redirect(fileResponse.presignedUrl);
        }
        (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, fileResponse.mimeType, fileFolder);
        res.setHeader('Accept-Ranges', 'bytes');
        if ((0, _utils.isDefined)(fileResponse.contentRange)) {
            const { startByte, endByte, fileSizeInBytes } = fileResponse.contentRange;
            res.status(206);
            res.setHeader('Content-Range', `bytes ${startByte}-${endByte}/${fileSizeInBytes}`);
            res.setHeader('Content-Length', String(endByte - startByte + 1));
        }
        try {
            await (0, _promises.pipeline)(fileResponse.stream, res);
        } catch (error) {
            fileResponse.stream.destroy();
            this.logger.error('File-by-id stream failed mid-transfer', {
                error
            });
            if (!res.headersSent) {
                throw new _fileexception.FileException('Error streaming file from storage', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
            }
            res.destroy();
        }
    }
    constructor(fileService, serverFileStorageService){
        this.fileService = fileService;
        this.serverFileStorageService = serverFileStorageService;
        this.logger = new _common.Logger(FileController.name);
    }
};
_ts_decorate([
    (0, _common.Get)(`${_types.ApiPath.Files}/application-registrations/:applicationRegistrationId/*path`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Param)('applicationRegistrationId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileController.prototype, "getApplicationRegistrationAsset", null);
_ts_decorate([
    (0, _common.Get)(`${_types.ApiPath.PublicAssets}/:workspaceId/:applicationId/*path`),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Param)('workspaceId')),
    _ts_param(3, (0, _common.Param)('applicationId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileController.prototype, "getPublicAssets", null);
_ts_decorate([
    (0, _common.Get)(`${_types.ApiPath.File}/:fileFolder/:id`),
    (0, _common.UseGuards)(_filebyidguard.FileByIdGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Param)('fileFolder')),
    _ts_param(3, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        typeof FileByIdRequest === "undefined" ? Object : FileByIdRequest,
        typeof _filebyidguard.SupportedFileFolder === "undefined" ? Object : _filebyidguard.SupportedFileFolder,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileController.prototype, "getFileById", null);
FileController = _ts_decorate([
    (0, _common.Controller)(),
    (0, _common.UseFilters)(_fileapiexceptionfilter.FileApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService,
        typeof _serverfilestorageservice.ServerFileStorageService === "undefined" ? Object : _serverfilestorageservice.ServerFileStorageService
    ])
], FileController);

//# sourceMappingURL=file.controller.js.map