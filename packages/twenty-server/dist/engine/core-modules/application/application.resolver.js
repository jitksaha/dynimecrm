"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationResolver", {
    enumerable: true,
    get: function() {
        return ApplicationResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _applicationstopservice = require("./application-stop/application-stop.service");
const _applicationdto = require("./dtos/application.dto");
const _sdkclientchecksumsdto = require("../sdk-client/dtos/sdk-client-checksums.dto");
const _getinstalledsdkmetadatamoduleutil = require("../sdk-client/utils/get-installed-sdk-metadata-module.util");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _workspaceentity = require("../workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _workspacecacheservice = require("../../workspace-cache/services/workspace-cache.service");
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
let ApplicationResolver = class ApplicationResolver {
    async applicationSdkClientChecksums(applicationId, workspace) {
        const { flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspace.id, [
            'flatApplicationMaps'
        ]);
        const application = flatApplicationMaps.byId[applicationId];
        if (!(0, _utils.isDefined)(application)) {
            return null;
        }
        return {
            core: application.sdkClientCoreChecksum,
            metadata: (await (0, _getinstalledsdkmetadatamoduleutil.getInstalledSdkMetadataModule)()).checksum
        };
    }
    // Surfaces the kill switch so clients can warn users that the app is
    // temporarily stopped and behaving in a degraded way. Kept as a dedicated
    // query so listing applications does not trigger one Redis read per app.
    async isApplicationStopped(applicationUniversalIdentifier) {
        return this.applicationStopService.isApplicationStopped(applicationUniversalIdentifier);
    }
    // Resolves the display url of the logo bundled in the installed
    // application's public assets, so clients never build file urls themselves.
    logoUrl(application, workspace) {
        const logo = application.logo;
        if (!(0, _utils.isDefined)(logo) || logo.length === 0) {
            return null;
        }
        if ((0, _utils.isAbsoluteUrl)(logo)) {
            return logo;
        }
        const serverUrl = this.twentyConfigService.get('SERVER_URL');
        return `${serverUrl}/${_types.ApiPath.PublicAssets}/${workspace.id}/${application.id}/${logo}`;
    }
    constructor(twentyConfigService, workspaceCacheService, applicationStopService){
        this.twentyConfigService = twentyConfigService;
        this.workspaceCacheService = workspaceCacheService;
        this.applicationStopService = applicationStopService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_sdkclientchecksumsdto.SdkClientChecksumsDTO, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Args)('applicationId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationResolver.prototype, "applicationSdkClientChecksums", null);
_ts_decorate([
    (0, _graphql.Query)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('applicationUniversalIdentifier')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationResolver.prototype, "isApplicationStopped", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>String, {
        nullable: true
    }),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Pick === "undefined" ? Object : Pick,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Object)
], ApplicationResolver.prototype, "logoUrl", null);
ApplicationResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _nopermissionguard.NoPermissionGuard),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_applicationdto.ApplicationDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationstopservice.ApplicationStopService === "undefined" ? Object : _applicationstopservice.ApplicationStopService
    ])
], ApplicationResolver);

//# sourceMappingURL=application.resolver.js.map