"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FrontComponentSharedDependenciesController", {
    enumerable: true,
    get: function() {
        return FrontComponentSharedDependenciesController;
    }
});
const _common = require("@nestjs/common");
const _promises = require("node:stream/promises");
const _express = require("express");
const _types = require("twenty-shared/types");
const _applicationrestapiexceptionfilter = require("../application-rest-api-exception.filter");
const _frontcomponentshareddependenciesservice = require("./front-component-shared-dependencies.service");
const _extractchecksumfromcachekeyutil = require("./utils/extract-checksum-from-cache-key.util");
const _getshareddependenciesbundlecachecontrolutil = require("./utils/get-shared-dependencies-bundle-cache-control.util");
const _applicationexception = require("../application.exception");
const _filestorageexception = require("../../file-storage/interfaces/file-storage-exception");
const _filefolderinterface = require("../../file/interfaces/file-folder.interface");
const _setfileresponseheadersutils = require("../../file/utils/set-file-response-headers.utils");
const _workspaceentity = require("../../workspace/workspace.entity");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
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
let FrontComponentSharedDependenciesController = class FrontComponentSharedDependenciesController {
    async getBuiltSharedDependencies(res, applicationId, workspace, cacheKey) {
        const { fileResponse, frontComponentSharedDependenciesChecksum } = await this.frontComponentSharedDependenciesService.getBuiltSharedDependenciesPresignedUrlOrStream({
            applicationId,
            workspaceId: workspace.id
        }).catch((error)=>{
            if (error instanceof _filestorageexception.FileStorageException && error.code === _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND) {
                throw new _applicationexception.ApplicationException(`Shared dependencies bundle not found for application "${applicationId}"`, _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND);
            }
            if (!(error instanceof _applicationexception.ApplicationException)) {
                this.logger.error('getBuiltSharedDependenciesPresignedUrlOrStream failed unexpectedly', {
                    error
                });
            }
            throw error;
        });
        if (fileResponse.type === 'redirect') {
            res.setHeader('Cache-Control', _filefolderinterface.PRESIGNED_URL_NO_STORE_CACHE_CONTROL);
            return res.json({
                url: fileResponse.presignedUrl
            });
        }
        (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, fileResponse.mimeType, _types.FileFolder.BuiltFrontComponent);
        res.setHeader('Cache-Control', (0, _getshareddependenciesbundlecachecontrolutil.getSharedDependenciesBundleCacheControl)({
            requestedChecksum: (0, _extractchecksumfromcachekeyutil.extractChecksumFromCacheKey)(cacheKey),
            frontComponentSharedDependenciesChecksum
        }));
        try {
            await (0, _promises.pipeline)(fileResponse.stream, res);
        } catch (error) {
            fileResponse.stream.destroy();
            this.logger.error('Shared dependencies bundle stream failed mid-transfer', {
                error
            });
            if (!res.headersSent) {
                throw error;
            }
            res.destroy();
        }
    }
    constructor(frontComponentSharedDependenciesService){
        this.frontComponentSharedDependenciesService = frontComponentSharedDependenciesService;
        this.logger = new _common.Logger(FrontComponentSharedDependenciesController.name);
    }
};
_ts_decorate([
    (0, _common.Get)([
        ':applicationId',
        ':applicationId/:cacheKey'
    ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('applicationId')),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(3, (0, _common.Param)('cacheKey')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FrontComponentSharedDependenciesController.prototype, "getBuiltSharedDependencies", null);
FrontComponentSharedDependenciesController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/front-component-shared-dependencies`),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_applicationrestapiexceptionfilter.ApplicationRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _frontcomponentshareddependenciesservice.FrontComponentSharedDependenciesService === "undefined" ? Object : _frontcomponentshareddependenciesservice.FrontComponentSharedDependenciesService
    ])
], FrontComponentSharedDependenciesController);

//# sourceMappingURL=front-component-shared-dependencies.controller.js.map