"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocalLayerManagerService", {
    enumerable: true,
    get: function() {
        return LocalLayerManagerService;
    }
});
const _fs = require("fs");
const _path = require("path");
const _copyyarnengineandbuilddependencies = require("../../../../../application/application-package/utils/copy-yarn-engine-and-build-dependencies");
const _localdriverconstant = require("../constants/local-driver.constant");
const _getlocaldepslayerpathutil = require("../utils/get-local-deps-layer-path.util");
const _getlocalsdklayerpathutil = require("../utils/get-local-sdk-layer-path.util");
const _pathexistsutil = require("../utils/path-exists.util");
let LocalLayerManagerService = class LocalLayerManagerService {
    async ensureDepsLayer({ flatApplication, applicationUniversalIdentifier }) {
        const depsLayerPath = (0, _getlocaldepslayerpathutil.getLocalDepsLayerPath)(flatApplication);
        const depsReadySentinelPath = (0, _path.join)(depsLayerPath, _localdriverconstant.LAYER_BUILD_READY_SENTINEL);
        if (await (0, _pathexistsutil.pathExists)(depsReadySentinelPath)) {
            return;
        }
        const lockKey = `local-driver-deps-layer:${flatApplication.yarnLockChecksum ?? 'default'}`;
        await this.cacheLockService.withLock(async ()=>{
            if (await (0, _pathexistsutil.pathExists)(depsReadySentinelPath)) {
                return;
            }
            await _fs.promises.rm(depsLayerPath, {
                recursive: true,
                force: true
            });
            await this.logicFunctionResourceService.copyDependenciesInMemory({
                applicationUniversalIdentifier,
                workspaceId: flatApplication.workspaceId,
                inMemoryFolderPath: depsLayerPath
            });
            await (0, _copyyarnengineandbuilddependencies.copyYarnEngineAndBuildDependencies)(depsLayerPath);
            await _fs.promises.writeFile(depsReadySentinelPath, '');
        }, lockKey, {
            ttl: _localdriverconstant.LAYER_BUILD_LOCK_TTL_MS,
            ms: _localdriverconstant.LAYER_BUILD_LOCK_RETRY_MS,
            maxRetries: _localdriverconstant.LAYER_BUILD_LOCK_MAX_RETRIES
        });
    }
    async ensureSdkLayer({ flatApplication, applicationUniversalIdentifier }) {
        const sdkLayerPath = (0, _getlocalsdklayerpathutil.getLocalSdkLayerPath)({
            workspaceId: flatApplication.workspaceId,
            applicationUniversalIdentifier
        });
        const sdkNodeModulesPath = (0, _path.join)(sdkLayerPath, 'node_modules');
        const sdkReadySentinelPath = (0, _path.join)(sdkLayerPath, _localdriverconstant.LAYER_BUILD_READY_SENTINEL);
        if (await (0, _pathexistsutil.pathExists)(sdkReadySentinelPath) && !flatApplication.isSdkLayerStale) {
            return;
        }
        const lockKey = `local-driver-sdk-layer:${flatApplication.workspaceId}:${applicationUniversalIdentifier}`;
        await this.cacheLockService.withLock(async ()=>{
            const { flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(flatApplication.workspaceId, [
                'flatApplicationMaps'
            ]);
            const freshFlatApplication = flatApplicationMaps.byId[flatApplication.id];
            const isStale = freshFlatApplication?.isSdkLayerStale ?? true;
            if (await (0, _pathexistsutil.pathExists)(sdkReadySentinelPath) && !isStale) {
                return;
            }
            await _fs.promises.rm(sdkLayerPath, {
                recursive: true,
                force: true
            });
            const sdkPackagePath = (0, _path.join)(sdkNodeModulesPath, 'twenty-client-sdk');
            await this.sdkClientArchiveService.downloadAndExtractToPackage({
                workspaceId: flatApplication.workspaceId,
                applicationId: flatApplication.id,
                applicationUniversalIdentifier,
                targetPackagePath: sdkPackagePath
            });
            await this.sdkClientArchiveService.markSdkLayerFresh({
                applicationId: flatApplication.id,
                workspaceId: flatApplication.workspaceId
            });
            await _fs.promises.writeFile(sdkReadySentinelPath, '');
        }, lockKey, {
            ttl: _localdriverconstant.LAYER_BUILD_LOCK_TTL_MS,
            ms: _localdriverconstant.LAYER_BUILD_LOCK_RETRY_MS,
            maxRetries: _localdriverconstant.LAYER_BUILD_LOCK_MAX_RETRIES
        });
    }
    constructor(cacheLockService, logicFunctionResourceService, sdkClientArchiveService, workspaceCacheService){
        this.cacheLockService = cacheLockService;
        this.logicFunctionResourceService = logicFunctionResourceService;
        this.sdkClientArchiveService = sdkClientArchiveService;
        this.workspaceCacheService = workspaceCacheService;
    }
};

//# sourceMappingURL=local-layer-manager.service.js.map