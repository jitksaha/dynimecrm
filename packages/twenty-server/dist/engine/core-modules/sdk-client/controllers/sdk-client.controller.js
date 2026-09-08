"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SdkClientController", {
    enumerable: true,
    get: function() {
        return SdkClientController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _allowedsdkmodules = require("../constants/allowed-sdk-modules");
const _sdkclientmodulecachecontrol = require("../constants/sdk-client-module-cache-control");
const _sdkclientarchiveservice = require("../sdk-client-archive.service");
const _getinstalledsdkmetadatamoduleutil = require("../utils/get-installed-sdk-metadata-module.util");
const _workspaceentity = require("../../workspace/workspace.entity");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let SdkClientController = class SdkClientController {
    async getInstanceSdkMetadataModule(res, checksum) {
        const { moduleBuffer, checksum: servedModuleChecksum } = await (0, _getinstalledsdkmetadatamoduleutil.getInstalledSdkMetadataModule)();
        this.sendSdkModule({
            res,
            moduleBuffer,
            servedModuleChecksum,
            requestedChecksum: checksum
        });
    }
    async getSdkModule(res, applicationId, moduleName, workspace, checksum) {
        if (!_allowedsdkmodules.ALLOWED_SDK_MODULES.includes(moduleName)) {
            throw new _common.NotFoundException(`SDK module "${moduleName}" not found. Allowed: ${_allowedsdkmodules.ALLOWED_SDK_MODULES.join(', ')}`);
        }
        const { flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspace.id, [
            'flatApplicationMaps'
        ]);
        const application = flatApplicationMaps.byId[applicationId];
        if (!(0, _utils.isDefined)(application)) {
            throw new _common.NotFoundException(`Application "${applicationId}" not found in workspace "${workspace.id}"`);
        }
        const { moduleBuffer, checksum: servedModuleChecksum } = moduleName === 'metadata' ? await (0, _getinstalledsdkmetadatamoduleutil.getInstalledSdkMetadataModule)() : {
            moduleBuffer: await this.sdkClientArchiveService.getClientModuleFromArchive({
                workspaceId: workspace.id,
                applicationId,
                applicationUniversalIdentifier: application.universalIdentifier,
                moduleName
            }),
            checksum: application.sdkClientCoreChecksum
        };
        this.sendSdkModule({
            res,
            moduleBuffer,
            servedModuleChecksum,
            requestedChecksum: checksum
        });
    }
    sendSdkModule({ res, moduleBuffer, servedModuleChecksum, requestedChecksum }) {
        const isChecksumMatch = (0, _utils.isDefined)(requestedChecksum) && requestedChecksum === servedModuleChecksum;
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', isChecksumMatch ? _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_CACHE_CONTROL : _sdkclientmodulecachecontrol.SDK_CLIENT_MODULE_NO_STORE_CACHE_CONTROL);
        res.send(moduleBuffer);
    }
    constructor(workspaceCacheService, sdkClientArchiveService){
        this.workspaceCacheService = workspaceCacheService;
        this.sdkClientArchiveService = sdkClientArchiveService;
    }
};
_ts_decorate([
    (0, _common.Get)([
        'metadata',
        'metadata/:checksum'
    ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('checksum')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SdkClientController.prototype, "getInstanceSdkMetadataModule", null);
_ts_decorate([
    (0, _common.Get)([
        ':applicationId/:moduleName',
        ':applicationId/:moduleName/:checksum'
    ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('applicationId')),
    _ts_param(2, (0, _common.Param)('moduleName')),
    _ts_param(3, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(4, (0, _common.Param)('checksum')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        typeof SdkModuleName === "undefined" ? Object : SdkModuleName,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], SdkClientController.prototype, "getSdkModule", null);
SdkClientController = _ts_decorate([
    (0, _common.Controller)(`${_types.ApiPath.Rest}/sdk-client`),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _sdkclientarchiveservice.SdkClientArchiveService === "undefined" ? Object : _sdkclientarchiveservice.SdkClientArchiveService
    ])
], SdkClientController);

//# sourceMappingURL=sdk-client.controller.js.map