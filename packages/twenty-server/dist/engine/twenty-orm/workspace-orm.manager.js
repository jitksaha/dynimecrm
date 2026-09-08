"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceOrmManager", {
    enumerable: true,
    get: function() {
        return WorkspaceOrmManager;
    }
});
const _common = require("@nestjs/common");
const _workspaceauthcontextstorage = require("../core-modules/auth/storage/workspace-auth-context.storage");
const _buildobjectidbynamemapsutil = require("../metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const _ormworkspacecontextstorage = require("./storage/orm-workspace-context.storage");
const _workspacedatasourceservice = require("./datasource/workspace-data-source.service");
const _workspacecacheservice = require("../workspace-cache/services/workspace-cache.service");
const _convertclasstoobjectmetadatanameutil = require("../workspace-manager/utils/convert-class-to-object-metadata-name.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceOrmManager = class WorkspaceOrmManager {
    getRepository(workspaceEntityOrObjectMetadataName, permissionOptions, repositoryOptions) {
        const objectMetadataName = this.resolveObjectMetadataName(workspaceEntityOrObjectMetadataName);
        return this.workspaceDataSourceService.getDataSource({
            useReplica: repositoryOptions?.useReplica ?? false
        }).getRepository(objectMetadataName, permissionOptions, {
            shouldSkipEventEmission: repositoryOptions?.shouldSkipEventEmission ?? false
        });
    }
    resolveObjectMetadataName(workspaceEntityOrObjectMetadataName) {
        if (typeof workspaceEntityOrObjectMetadataName === 'string') {
            return workspaceEntityOrObjectMetadataName;
        }
        return (0, _convertclasstoobjectmetadatanameutil.convertClassNameToObjectMetadataName)(workspaceEntityOrObjectMetadataName.name);
    }
    async runInWorkspaceTransaction(work) {
        return this.workspaceDataSourceService.getDataSource({
            useReplica: false
        }).transaction(work);
    }
    async executeInWorkspaceContext(fn, authContext, options) {
        const resolvedAuthContext = authContext ?? (0, _workspaceauthcontextstorage.getWorkspaceAuthContext)();
        const context = options?.lite ? await this.loadLiteWorkspaceContext(resolvedAuthContext) : await this.loadWorkspaceContext(resolvedAuthContext);
        return (0, _ormworkspacecontextstorage.withWorkspaceContext)(context, fn);
    }
    async loadWorkspaceContext(authContext) {
        const workspaceId = authContext.workspace.id;
        const { flatObjectMetadataMaps, flatFieldMetadataMapsOrm, flatIndexMaps, featureFlagsMap, rolesPermissions: permissionsPerRoleId, userWorkspaceRoleMap, apiKeyRoleMap, flatRowLevelPermissionPredicateMaps, flatRowLevelPermissionPredicateGroupMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMapsOrm',
            'flatIndexMaps',
            'featureFlagsMap',
            'rolesPermissions',
            'userWorkspaceRoleMap',
            'apiKeyRoleMap',
            'flatRowLevelPermissionPredicateMaps',
            'flatRowLevelPermissionPredicateGroupMaps'
        ]);
        const { idByNameSingular: objectIdByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
        return {
            authContext,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps: flatFieldMetadataMapsOrm,
            flatIndexMaps,
            flatRowLevelPermissionPredicateMaps,
            flatRowLevelPermissionPredicateGroupMaps,
            objectIdByNameSingular,
            featureFlagsMap,
            permissionsPerRoleId,
            userWorkspaceRoleMap,
            apiKeyRoleMap
        };
    }
    async loadLiteWorkspaceContext(authContext) {
        const workspaceId = authContext.workspace.id;
        const { flatObjectMetadataMaps, flatFieldMetadataMapsOrm } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMapsOrm'
        ]);
        const { idByNameSingular: objectIdByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
        return {
            authContext,
            flatObjectMetadataMaps,
            flatFieldMetadataMaps: flatFieldMetadataMapsOrm,
            flatIndexMaps: {
                byUniversalIdentifier: {},
                universalIdentifierById: {},
                universalIdentifiersByApplicationId: {}
            },
            flatRowLevelPermissionPredicateMaps: {
                byUniversalIdentifier: {},
                universalIdentifierById: {},
                universalIdentifiersByApplicationId: {}
            },
            flatRowLevelPermissionPredicateGroupMaps: {
                byUniversalIdentifier: {},
                universalIdentifierById: {},
                universalIdentifiersByApplicationId: {}
            },
            objectIdByNameSingular,
            featureFlagsMap: {},
            permissionsPerRoleId: {},
            userWorkspaceRoleMap: {},
            apiKeyRoleMap: {}
        };
    }
    constructor(workspaceCacheService, workspaceDataSourceService){
        this.workspaceCacheService = workspaceCacheService;
        this.workspaceDataSourceService = workspaceDataSourceService;
    }
};
WorkspaceOrmManager = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacedatasourceservice.WorkspaceDataSourceService === "undefined" ? Object : _workspacedatasourceservice.WorkspaceDataSourceService
    ])
], WorkspaceOrmManager);

//# sourceMappingURL=workspace-orm.manager.js.map