"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocalDriver", {
    enumerable: true,
    get: function() {
        return LocalDriver;
    }
});
const _fs = require("fs");
const _path = require("path");
const _esbuild = require("esbuild");
const _application = require("twenty-shared/application");
const _localchildprocessrunnerservice = require("./local/services/local-child-process-runner.service");
const _locallayermanagerservice = require("./local/services/local-layer-manager.service");
const _localprebuiltbundleservice = require("./local/services/local-prebuilt-bundle.service");
const _interceptconsole = require("../utils/intercept-console");
const _temporarydirmanager = require("../utils/temporary-dir-manager");
const _logicfunctionexecutionresultdto = require("../../../../metadata-modules/logic-function/dtos/logic-function-execution-result.dto");
const _logicfunctionentity = require("../../../../metadata-modules/logic-function/logic-function.entity");
const _logicfunctionexception = require("../../../../metadata-modules/logic-function/logic-function.exception");
const _islogicfunctionreadyforprebuiltinstallutil = require("../../../../metadata-modules/logic-function/utils/is-logic-function-ready-for-prebuilt-install.util");
let LocalDriver = class LocalDriver {
    async transpile({ sourceCode, sourceFileName, builtFileName }) {
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        const { sourceTemporaryDir } = await temporaryDirManager.init();
        try {
            const entryFilePath = (0, _path.join)(sourceTemporaryDir, sourceFileName);
            const builtBundleFilePath = (0, _path.join)(sourceTemporaryDir, builtFileName);
            await _fs.promises.mkdir((0, _path.dirname)(entryFilePath), {
                recursive: true
            });
            await _fs.promises.writeFile(entryFilePath, sourceCode, 'utf-8');
            await _fs.promises.mkdir((0, _path.dirname)(builtBundleFilePath), {
                recursive: true
            });
            await (0, _esbuild.build)({
                entryPoints: [
                    entryFilePath
                ],
                outfile: builtBundleFilePath,
                platform: 'node',
                format: 'esm',
                target: 'esnext',
                bundle: true,
                sourcemap: true,
                packages: 'external',
                banner: _application.NODE_ESM_CJS_BANNER
            });
            const builtCode = await _fs.promises.readFile(builtBundleFilePath, 'utf-8');
            return {
                builtCode
            };
        } finally{
            await temporaryDirManager.clean();
        }
    }
    async delete() {}
    async deleteApplicationResources() {}
    async installPrebuiltBundle(params) {
        await this.prebuiltBundle.installPrebuiltBundle(params);
    }
    async getInstalledBundleChecksum(flatLogicFunction) {
        return this.prebuiltBundle.getInstalledBundleChecksum(flatLogicFunction);
    }
    async execute({ flatLogicFunction, flatApplication, applicationUniversalIdentifier, payload, context, env, timeoutMs = 900_000, forceExecutionMode }) {
        const executionMode = forceExecutionMode ?? flatLogicFunction.executionMode;
        if (executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT && !(0, _islogicfunctionreadyforprebuiltinstallutil.isLogicFunctionReadyForPrebuiltInstall)(flatLogicFunction)) {
            throw new _logicfunctionexception.LogicFunctionException(`Cannot run logic function '${flatLogicFunction.id}' in PREBUILT mode: bundle is not installed`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED);
        }
        await this.layerManager.ensureDepsLayer({
            flatApplication,
            applicationUniversalIdentifier
        });
        await this.layerManager.ensureSdkLayer({
            flatApplication,
            applicationUniversalIdentifier
        });
        const startTime = Date.now();
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        try {
            const { sourceTemporaryDir } = await temporaryDirManager.init();
            await this.childProcessRunner.assembleNodeModules({
                sourceTemporaryDir,
                flatApplication,
                applicationUniversalIdentifier
            });
            const inMemoryBuiltHandlerPath = executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT ? await this.prebuiltBundle.copyPrebuiltBundleIntoExecutionDir({
                flatLogicFunction,
                sourceTemporaryDir
            }) : await this.logicFunctionResourceService.copyBuiltCodeInMemory({
                workspaceId: flatLogicFunction.workspaceId,
                applicationUniversalIdentifier,
                builtHandlerPath: flatLogicFunction.builtHandlerPath,
                inMemoryDestinationPath: sourceTemporaryDir
            });
            let logs = '';
            const consoleListener = new _interceptconsole.ConsoleListener();
            consoleListener.intercept((type, args)=>{
                const formattedArgs = args.map((arg)=>{
                    if (typeof arg === 'object' && arg !== null) {
                        const seen = new WeakSet();
                        return JSON.stringify(arg, (_key, value)=>{
                            if (typeof value === 'object' && value !== null) {
                                if (seen.has(value)) {
                                    return '[Circular]';
                                }
                                seen.add(value);
                            }
                            return value;
                        }, 2);
                    }
                    return arg;
                });
                const formattedType = type === 'log' ? 'info' : type;
                logs += `${new Date().toISOString()} ${formattedType.toUpperCase()} ${formattedArgs.join(' ')}\n`;
            });
            try {
                const runnerPath = await this.childProcessRunner.writeBootstrapRunner({
                    dir: sourceTemporaryDir,
                    builtFileAbsPath: inMemoryBuiltHandlerPath,
                    handlerName: flatLogicFunction.handlerName
                });
                const { ok, result, errorType, error, stack, stdout, stderr } = await this.childProcessRunner.runChildWithEnv({
                    runnerPath,
                    env: env ?? {},
                    payload,
                    context,
                    timeoutMs
                });
                if (stdout) logs += stdout.split('\n').filter(Boolean).map((l)=>`${new Date().toISOString()} INFO ${l}`).join('\n') + '\n';
                if (stderr) logs += stderr.split('\n').filter(Boolean).map((l)=>`${new Date().toISOString()} ERROR ${l}`).join('\n') + '\n';
                const duration = Date.now() - startTime;
                if (ok) {
                    return {
                        data: result ?? null,
                        logs,
                        duration,
                        billedDurationMs: duration,
                        status: _logicfunctionexecutionresultdto.LogicFunctionExecutionStatus.SUCCESS
                    };
                }
                return {
                    data: null,
                    logs,
                    duration,
                    billedDurationMs: duration,
                    error: {
                        errorType: errorType ?? 'UnhandledError',
                        errorMessage: error || 'Unknown error',
                        stackTrace: stack ? String(stack).split('\n') : []
                    },
                    status: _logicfunctionexecutionresultdto.LogicFunctionExecutionStatus.ERROR
                };
            } finally{
                consoleListener.release();
            }
        } finally{
            await temporaryDirManager.clean();
        }
    }
    constructor(options){
        this.logicFunctionResourceService = options.logicFunctionResourceService;
        this.layerManager = new _locallayermanagerservice.LocalLayerManagerService(options.cacheLockService, options.logicFunctionResourceService, options.sdkClientArchiveService, options.workspaceCacheService);
        this.childProcessRunner = new _localchildprocessrunnerservice.LocalChildProcessRunnerService();
        this.prebuiltBundle = new _localprebuiltbundleservice.LocalPrebuiltBundleService(options.cacheLockService, options.logicFunctionResourceService);
    }
};

//# sourceMappingURL=local.driver.js.map