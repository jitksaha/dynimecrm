"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocalPrebuiltBundleService", {
    enumerable: true,
    get: function() {
        return LocalPrebuiltBundleService;
    }
});
const _fs = require("fs");
const _path = require("path");
const _guards = require("@sniptt/guards");
const _localdriverconstant = require("../constants/local-driver.constant");
const _getlocalprebuiltbundlepathsutil = require("../utils/get-local-prebuilt-bundle-paths.util");
const _logicfunctionexception = require("../../../../../../metadata-modules/logic-function/logic-function.exception");
let LocalPrebuiltBundleService = class LocalPrebuiltBundleService {
    async installPrebuiltBundle({ flatLogicFunction, applicationUniversalIdentifier }) {
        if (!(0, _guards.isNonEmptyString)(flatLogicFunction.checksum)) {
            throw new _logicfunctionexception.LogicFunctionException(`Cannot install prebuilt bundle for function '${flatLogicFunction.id}' without a checksum`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED);
        }
        const checksum = flatLogicFunction.checksum;
        await this.cacheLockService.withLock(async ()=>{
            if (await this.getInstalledBundleChecksum(flatLogicFunction) === checksum) {
                return;
            }
            const prebuiltDir = (0, _getlocalprebuiltbundlepathsutil.getLocalPrebuiltBundleDir)(flatLogicFunction);
            await _fs.promises.mkdir(prebuiltDir, {
                recursive: true
            });
            await this.logicFunctionResourceService.copyBuiltCodeInMemory({
                workspaceId: flatLogicFunction.workspaceId,
                applicationUniversalIdentifier,
                builtHandlerPath: flatLogicFunction.builtHandlerPath,
                inMemoryDestinationPath: prebuiltDir
            });
            const downloadedPath = (0, _path.join)(prebuiltDir, flatLogicFunction.builtHandlerPath);
            const targetPath = (0, _getlocalprebuiltbundlepathsutil.getLocalInstalledBundlePath)(flatLogicFunction);
            if (downloadedPath !== targetPath) {
                await _fs.promises.mkdir((0, _path.dirname)(targetPath), {
                    recursive: true
                });
                await _fs.promises.rename(downloadedPath, targetPath);
            }
            await _fs.promises.writeFile((0, _getlocalprebuiltbundlepathsutil.getLocalInstalledChecksumPath)(flatLogicFunction), checksum, 'utf8');
        }, `local-install:${flatLogicFunction.id}`, {
            ttl: _localdriverconstant.PREBUILT_INSTALL_LOCK_TTL_MS,
            ms: _localdriverconstant.PREBUILT_INSTALL_LOCK_RETRY_MS,
            maxRetries: _localdriverconstant.PREBUILT_INSTALL_LOCK_MAX_RETRIES
        });
    }
    async getInstalledBundleChecksum(flatLogicFunction) {
        try {
            const checksum = await _fs.promises.readFile((0, _getlocalprebuiltbundlepathsutil.getLocalInstalledChecksumPath)(flatLogicFunction), 'utf8');
            return checksum.trim() || null;
        } catch  {
            return null;
        }
    }
    async copyPrebuiltBundleIntoExecutionDir({ flatLogicFunction, sourceTemporaryDir }) {
        const installedBundlePath = (0, _getlocalprebuiltbundlepathsutil.getLocalInstalledBundlePath)(flatLogicFunction);
        const localBundlePath = (0, _path.join)(sourceTemporaryDir, _localdriverconstant.PREBUILT_BUNDLE_FILE_NAME);
        await _fs.promises.copyFile(installedBundlePath, localBundlePath);
        return localBundlePath;
    }
    constructor(cacheLockService, logicFunctionResourceService){
        this.cacheLockService = cacheLockService;
        this.logicFunctionResourceService = logicFunctionResourceService;
    }
};

//# sourceMappingURL=local-prebuilt-bundle.service.js.map