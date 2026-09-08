"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FrontComponentController", {
    enumerable: true,
    get: function() {
        return FrontComponentController;
    }
});
const _common = require("@nestjs/common");
const _promises = require("node:stream/promises");
const _express = require("express");
const _types = require("twenty-shared/types");
const _filestorageexception = require("../../../core-modules/file-storage/interfaces/file-storage-exception");
const _filefolderinterface = require("../../../core-modules/file/interfaces/file-folder.interface");
const _setfileresponseheadersutils = require("../../../core-modules/file/utils/set-file-response-headers.utils");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _flatentitymapsrestapiexceptionfilter = require("../../flat-entity/filters/flat-entity-maps-rest-api-exception.filter");
const _frontcomponentrestapiexceptionfilter = require("../filters/front-component-rest-api-exception.filter");
const _frontcomponentexception = require("../front-component.exception");
const _frontcomponentservice = require("../front-component.service");
const _permissionsrestapiexceptionfilter = require("../../permissions/utils/permissions-rest-api-exception.filter");
const _workspacemigrationrunnerrestapiexceptionfilter = require("../../../workspace-manager/workspace-migration/filters/workspace-migration-runner-rest-api-exception.filter");
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
let FrontComponentController = class FrontComponentController {
    async getBuiltJs(res, frontComponentId, workspace) {
        const fileResponse = await this.frontComponentService.getBuiltComponentPresignedUrlOrStream({
            frontComponentId,
            workspaceId: workspace.id
        }).catch((error)=>{
            if (error instanceof _frontcomponentexception.FrontComponentException) {
                throw error;
            }
            if (error instanceof _filestorageexception.FileStorageException && error.code === _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND) {
                throw new _frontcomponentexception.FrontComponentException('Front component built file not found', _frontcomponentexception.FrontComponentExceptionCode.FRONT_COMPONENT_NOT_FOUND);
            }
            this.logger.error('getBuiltComponentPresignedUrlOrStream failed unexpectedly', {
                error
            });
            throw new _frontcomponentexception.FrontComponentException('Error retrieving front component built file', _frontcomponentexception.FrontComponentExceptionCode.FRONT_COMPONENT_NOT_READY);
        });
        if (fileResponse.type === 'redirect') {
            res.setHeader('Cache-Control', _filefolderinterface.PRESIGNED_URL_NO_STORE_CACHE_CONTROL);
            return res.json({
                url: fileResponse.presignedUrl
            });
        }
        (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, fileResponse.mimeType, _types.FileFolder.BuiltFrontComponent);
        try {
            await (0, _promises.pipeline)(fileResponse.stream, res);
        } catch (error) {
            fileResponse.stream.destroy();
            this.logger.error('Front component stream failed mid-transfer', {
                error
            });
            if (!res.headersSent) {
                throw new _frontcomponentexception.FrontComponentException('Error streaming front component built file', _frontcomponentexception.FrontComponentExceptionCode.FRONT_COMPONENT_NOT_READY);
            }
            res.destroy();
        }
    }
    constructor(frontComponentService){
        this.frontComponentService = frontComponentService;
        this.logger = new _common.Logger(FrontComponentController.name);
    }
};
_ts_decorate([
    (0, _common.Get)([
        ':frontComponentId',
        ':frontComponentId/:cacheKey'
    ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('frontComponentId')),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], FrontComponentController.prototype, "getBuiltJs", null);
FrontComponentController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/front-components`),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_permissionsrestapiexceptionfilter.PermissionsRestApiExceptionFilter, _frontcomponentrestapiexceptionfilter.FrontComponentRestApiExceptionFilter, _flatentitymapsrestapiexceptionfilter.FlatEntityMapsRestApiExceptionFilter, _workspacemigrationrunnerrestapiexceptionfilter.WorkspaceMigrationRunnerRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _frontcomponentservice.FrontComponentService === "undefined" ? Object : _frontcomponentservice.FrontComponentService
    ])
], FrontComponentController);

//# sourceMappingURL=front-component.controller.js.map