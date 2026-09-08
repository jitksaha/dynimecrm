"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LambdaExecutorManagerService", {
    enumerable: true,
    get: function() {
        return LambdaExecutorManagerService;
    }
});
const _promises = /*#__PURE__*/ _interop_require_wildcard(require("node:fs/promises"));
const _path = require("path");
const _clientlambda = require("@aws-sdk/client-lambda");
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _cachelockexception = require("../../../../../cache-lock/exceptions/cache-lock.exception");
const _lambdadriverconstant = require("../constants/lambda-driver.constant");
const _copyexecutor = require("../../../utils/copy-executor");
const _createzipfile = require("../../../utils/create-zip-file");
const _temporarydirmanager = require("../../../utils/temporary-dir-manager");
const _logicfunctionexception = require("../../../../../../metadata-modules/logic-function/logic-function.exception");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let LambdaExecutorManagerService = class LambdaExecutorManagerService {
    async getLambdaExecutor(flatLogicFunction) {
        const lambdaClient = await this.awsClient.getLambdaClient();
        try {
            return await lambdaClient.send(new _clientlambda.GetFunctionCommand({
                FunctionName: flatLogicFunction.id
            }));
        } catch (error) {
            if (error instanceof _clientlambda.ResourceNotFoundException) {
                return undefined;
            }
            throw error;
        }
    }
    async delete(flatLogicFunction) {
        const lambdaExecutor = await this.getLambdaExecutor(flatLogicFunction);
        if (!(0, _utils.isDefined)(lambdaExecutor)) {
            return;
        }
        const lambdaClient = await this.awsClient.getLambdaClient();
        await lambdaClient.send(new _clientlambda.DeleteFunctionCommand({
            FunctionName: flatLogicFunction.id
        }));
    }
    async buildExecutor(context) {
        const { canSkip } = await this.checkBuildStatus(context);
        if (canSkip) {
            return;
        }
        const buildLockTtlMs = 120_000;
        const buildLockRetryMs = 500;
        const buildLockMaxRetries = 240;
        const lockKey = `lambda-build:${context.flatLogicFunction.id}`;
        try {
            await this.cacheLockService.withLock(async ()=>{
                // Refresh the application before re-checking: another process may
                // have rebuilt the SDK layer (and cleared isSdkLayerStale) while we
                // were waiting for the lock, and our request-time snapshot cannot
                // see it. Without this, every queued waiter rebuilds again.
                const refreshedContext = await this.refreshBuildContext(context);
                const { canSkip: canSkipAfterLock, lambdaExecutor } = await this.checkBuildStatus(refreshedContext);
                if (canSkipAfterLock) {
                    return;
                }
                await this.ensureExecutor({
                    ...refreshedContext,
                    lambdaExecutor
                });
            }, lockKey, {
                ttl: buildLockTtlMs,
                ms: buildLockRetryMs,
                maxRetries: buildLockMaxRetries
            });
        } catch (error) {
            const isLockAcquisitionTimeout = error instanceof _cachelockexception.CacheLockException && error.code === _cachelockexception.CacheLockExceptionCode.LOCK_ACQUISITION_TIMEOUT;
            if (!isLockAcquisitionTimeout) {
                throw error;
            }
            // Lock wait budget exhausted. If concurrent builds left the executor in
            // a usable state, proceed with the invocation instead of failing it.
            const { canSkip: isExecutorUsable } = await this.checkBuildStatus(await this.refreshBuildContext(context));
            if (!isExecutorUsable) {
                throw error;
            }
            this.logger.warn(`Lock acquisition timed out for ${lockKey} but executor is up to date, proceeding`);
        }
    }
    async refreshBuildContext(context) {
        const { flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(context.flatLogicFunction.workspaceId, [
            'flatApplicationMaps'
        ]);
        const refreshedFlatApplication = flatApplicationMaps.byId[context.flatApplication.id];
        return {
            ...context,
            flatApplication: refreshedFlatApplication ?? context.flatApplication
        };
    }
    async installPrebuiltBundle(context) {
        const { flatLogicFunction, applicationUniversalIdentifier } = context;
        if (!(0, _guards.isNonEmptyString)(flatLogicFunction.checksum)) {
            throw new _logicfunctionexception.LogicFunctionException(`Cannot install prebuilt bundle for function '${flatLogicFunction.id}' without a checksum`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED);
        }
        const checksum = flatLogicFunction.checksum;
        await this.buildExecutor(context);
        await this.cacheLockService.withLock(async ()=>{
            if (await this.getInstalledBundleChecksum(flatLogicFunction) === checksum) {
                return;
            }
            const compiledCode = await this.logicFunctionResourceService.getBuiltCode({
                workspaceId: flatLogicFunction.workspaceId,
                applicationUniversalIdentifier,
                builtHandlerPath: flatLogicFunction.builtHandlerPath
            });
            const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
            const { sourceTemporaryDir, lambdaZipPath } = await temporaryDirManager.init();
            try {
                await (0, _copyexecutor.copyExecutor)(sourceTemporaryDir);
                await _promises.writeFile((0, _path.join)(sourceTemporaryDir, _lambdadriverconstant.PREBUILT_BUNDLE_FILE_NAME), compiledCode, 'utf8');
                await (0, _createzipfile.createZipFile)(sourceTemporaryDir, lambdaZipPath);
                const lambdaClient = await this.awsClient.getLambdaClient();
                const updateResult = await lambdaClient.send(new _clientlambda.UpdateFunctionCodeCommand({
                    FunctionName: flatLogicFunction.id,
                    ZipFile: await _promises.readFile(lambdaZipPath)
                }));
                await this.awsClient.waitFunctionUpdated(flatLogicFunction.id);
                const functionArn = updateResult.FunctionArn;
                if (!(0, _guards.isNonEmptyString)(functionArn)) {
                    throw new _logicfunctionexception.LogicFunctionException(`UpdateFunctionCode did not return a FunctionArn for '${flatLogicFunction.id}'`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED);
                }
                await lambdaClient.send(new _clientlambda.TagResourceCommand({
                    Resource: functionArn,
                    Tags: {
                        [_lambdadriverconstant.LAMBDA_PREBUILT_BUNDLE_CHECKSUM_TAG]: checksum
                    }
                }));
            } catch (error) {
                this.logger.error(`Failed to install prebuilt bundle for function ${flatLogicFunction.id}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
                throw error;
            } finally{
                await temporaryDirManager.clean();
            }
        }, `lambda-install:${flatLogicFunction.id}`, {
            ttl: _lambdadriverconstant.PREBUILT_INSTALL_LOCK_TTL_MS,
            ms: _lambdadriverconstant.PREBUILT_INSTALL_LOCK_RETRY_MS,
            maxRetries: _lambdadriverconstant.PREBUILT_INSTALL_LOCK_MAX_RETRIES
        });
    }
    async getInstalledBundleChecksum(flatLogicFunction) {
        const lambdaExecutor = await this.getLambdaExecutor(flatLogicFunction);
        if (!(0, _utils.isDefined)(lambdaExecutor)) {
            return null;
        }
        return lambdaExecutor.Tags?.[_lambdadriverconstant.LAMBDA_PREBUILT_BUNDLE_CHECKSUM_TAG] ?? null;
    }
    async checkBuildStatus(context) {
        const { flatApplication, applicationUniversalIdentifier } = context;
        const lambdaExecutor = await this.getLambdaExecutor(context.flatLogicFunction);
        const isActive = lambdaExecutor?.Configuration?.State === 'Active';
        const canSkip = (0, _utils.isDefined)(lambdaExecutor) && isActive && !flatApplication.isSdkLayerStale && this.layerManager.hasExpectedLayers({
            lambdaExecutor,
            flatApplication,
            applicationUniversalIdentifier
        });
        return {
            canSkip,
            lambdaExecutor
        };
    }
    async ensureExecutor({ flatLogicFunction, flatApplication, applicationUniversalIdentifier, lambdaExecutor }) {
        let depsLayerArn;
        try {
            depsLayerArn = await this.layerManager.ensureDepsLayer({
                flatApplication,
                applicationUniversalIdentifier
            });
        } catch (error) {
            if (error instanceof _logicfunctionexception.LogicFunctionException && error.code === _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED) {
                throw error;
            }
            this.logger.error(`Failed to get dependency layer for function ${flatLogicFunction.id}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            throw new _logicfunctionexception.LogicFunctionException(`Failed to get dependency layer for function '${flatLogicFunction.id}': ${error instanceof Error ? error.message : 'Unknown error'}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_LAYER_BUILD_FAILED);
        }
        let sdkLayerArn;
        try {
            sdkLayerArn = await this.layerManager.ensureSdkLayer({
                flatApplication,
                applicationUniversalIdentifier
            });
        } catch (error) {
            this.logger.error(`Failed to get SDK layer for function ${flatLogicFunction.id}: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            throw new _logicfunctionexception.LogicFunctionException(`Failed to get SDK layer for function '${flatLogicFunction.id}': ${error instanceof Error ? error.message : 'Unknown error'}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_LAYER_BUILD_FAILED);
        }
        if (!(0, _utils.isDefined)(lambdaExecutor)) {
            await this.createExecutor({
                flatLogicFunction,
                depsLayerArn,
                sdkLayerArn
            });
            await this.awsClient.waitFunctionActive(flatLogicFunction.id);
            return;
        }
        await this.updateExecutorConfiguration({
            flatLogicFunction,
            depsLayerArn,
            sdkLayerArn
        });
        await this.awsClient.waitFunctionUpdated(flatLogicFunction.id);
    }
    async updateExecutorConfiguration({ flatLogicFunction, depsLayerArn, sdkLayerArn }) {
        const lambdaClient = await this.awsClient.getLambdaClient();
        await lambdaClient.send(new _clientlambda.UpdateFunctionConfigurationCommand({
            FunctionName: flatLogicFunction.id,
            Layers: [
                depsLayerArn,
                sdkLayerArn
            ],
            Runtime: flatLogicFunction.runtime,
            Timeout: _lambdadriverconstant.EXECUTOR_LAMBDA_TIMEOUT_SECONDS,
            MemorySize: _lambdadriverconstant.EXECUTOR_LAMBDA_MEMORY_MB
        }));
    }
    async createExecutor({ flatLogicFunction, depsLayerArn, sdkLayerArn }) {
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        const { sourceTemporaryDir, lambdaZipPath } = await temporaryDirManager.init();
        try {
            await (0, _copyexecutor.copyExecutor)(sourceTemporaryDir);
            await (0, _createzipfile.createZipFile)(sourceTemporaryDir, lambdaZipPath);
            // SDK layer listed last so it overwrites the stub twenty-client-sdk
            // from the deps layer (later layers take precedence in /opt merge).
            const params = {
                Code: {
                    ZipFile: await _promises.readFile(lambdaZipPath)
                },
                FunctionName: flatLogicFunction.id,
                Layers: [
                    depsLayerArn,
                    sdkLayerArn
                ],
                Handler: 'index.handler',
                Role: this.options.lambdaRole,
                Runtime: flatLogicFunction.runtime,
                Timeout: _lambdadriverconstant.EXECUTOR_LAMBDA_TIMEOUT_SECONDS,
                MemorySize: _lambdadriverconstant.EXECUTOR_LAMBDA_MEMORY_MB,
                EphemeralStorage: {
                    Size: _lambdadriverconstant.LAMBDA_EPHEMERAL_STORAGE_MB
                }
            };
            const lambdaClient = await this.awsClient.getLambdaClient();
            await lambdaClient.send(new _clientlambda.CreateFunctionCommand(params));
        } finally{
            await temporaryDirManager.clean();
        }
    }
    constructor(options, awsClient, layerManager, cacheLockService, logicFunctionResourceService, workspaceCacheService){
        this.options = options;
        this.awsClient = awsClient;
        this.layerManager = layerManager;
        this.cacheLockService = cacheLockService;
        this.logicFunctionResourceService = logicFunctionResourceService;
        this.workspaceCacheService = workspaceCacheService;
        this.logger = new _common.Logger(LambdaExecutorManagerService.name);
    }
};

//# sourceMappingURL=lambda-executor-manager.service.js.map