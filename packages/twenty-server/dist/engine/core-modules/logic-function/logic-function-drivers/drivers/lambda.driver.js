"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LambdaDriver", {
    enumerable: true,
    get: function() {
        return LambdaDriver;
    }
});
const _clientlambda = require("@aws-sdk/client-lambda");
const _common = require("@nestjs/common");
const _lambdadrivertype = require("./lambda/types/lambda-driver.type");
const _lambdaawsclientservice = require("./lambda/services/lambda-aws-client.service");
const _lambdaexecutormanagerservice = require("./lambda/services/lambda-executor-manager.service");
const _lambdalayermanagerservice = require("./lambda/services/lambda-layer-manager.service");
const _lambdatoolfunctionsservice = require("./lambda/services/lambda-tool-functions.service");
const _buildlogicfunctiontimeoutresultutil = require("./lambda/utils/build-logic-function-timeout-result.util");
const _parselambdalogresultutil = require("./lambda/utils/parse-lambda-log-result.util");
const _handlercontant = require("../../../../metadata-modules/logic-function/constants/handler.contant");
const _logicfunctionexecutionresultdto = require("../../../../metadata-modules/logic-function/dtos/logic-function-execution-result.dto");
const _logicfunctionentity = require("../../../../metadata-modules/logic-function/logic-function.entity");
const _logicfunctionexception = require("../../../../metadata-modules/logic-function/logic-function.exception");
const _islogicfunctionreadyforprebuiltinstallutil = require("../../../../metadata-modules/logic-function/utils/is-logic-function-ready-for-prebuilt-install.util");
let LambdaDriver = class LambdaDriver {
    async transpile({ sourceCode, sourceFileName, builtFileName }) {
        const { builtCode } = await this.toolFunctions.transpile({
            sourceCode,
            sourceFileName,
            builtFileName
        });
        return {
            builtCode
        };
    }
    async delete(flatLogicFunction) {
        await this.executorManager.delete(flatLogicFunction);
    }
    async deleteApplicationResources({ workspaceId, applicationUniversalIdentifier }) {
        await this.layerManager.deleteSdkLayer({
            workspaceId,
            applicationUniversalIdentifier
        });
    }
    async installPrebuiltBundle(params) {
        await this.executorManager.installPrebuiltBundle(params);
    }
    async getInstalledBundleChecksum(flatLogicFunction) {
        return this.executorManager.getInstalledBundleChecksum(flatLogicFunction);
    }
    async execute({ flatLogicFunction, flatApplication, applicationUniversalIdentifier, payload, context, env, timeoutMs = 900_000, forceExecutionMode }) {
        const executionMode = forceExecutionMode ?? flatLogicFunction.executionMode;
        if (executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT && !(0, _islogicfunctionreadyforprebuiltinstallutil.isLogicFunctionReadyForPrebuiltInstall)(flatLogicFunction)) {
            throw new _logicfunctionexception.LogicFunctionException(`Cannot run logic function '${flatLogicFunction.id}' in PREBUILT mode: bundle is not installed`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PREBUILT_BUNDLE_NOT_INSTALLED);
        }
        let currentPhase = _lambdadrivertype.LambdaExecutionPhase.BUILD;
        let buildExecutorMs = 0;
        let getBuiltCodeMs = 0;
        try {
            const buildStart = Date.now();
            await this.executorManager.buildExecutor({
                flatLogicFunction,
                flatApplication,
                applicationUniversalIdentifier
            });
            buildExecutorMs = Date.now() - buildStart;
            currentPhase = _lambdadrivertype.LambdaExecutionPhase.FETCH_CODE;
            const invokeFlowStart = Date.now();
            if (!_handlercontant.HANDLER_NAME_REGEX.test(flatLogicFunction.handlerName)) {
                throw new _logicfunctionexception.LogicFunctionException(`Invalid handlerName "${flatLogicFunction.handlerName}": must be a valid JavaScript identifier or dotted path`, _logicfunctionexception.LogicFunctionExceptionCode.INVALID_LOGIC_FUNCTION_INPUT);
            }
            const executorPayload = {
                params: payload,
                context,
                env: env ?? {},
                handlerName: flatLogicFunction.handlerName
            };
            if (executionMode === _logicfunctionentity.LogicFunctionExecutionMode.LIVE) {
                const fetchStart = Date.now();
                executorPayload.code = await this.logicFunctionResourceService.getBuiltCode({
                    workspaceId: flatLogicFunction.workspaceId,
                    applicationUniversalIdentifier,
                    builtHandlerPath: flatLogicFunction.builtHandlerPath
                });
                getBuiltCodeMs = Date.now() - fetchStart;
            }
            currentPhase = _lambdadrivertype.LambdaExecutionPhase.INVOKE;
            const payloadString = JSON.stringify(executorPayload);
            const params = {
                FunctionName: flatLogicFunction.id,
                Payload: payloadString,
                LogType: _clientlambda.LogType.Tail
            };
            const command = new _clientlambda.InvokeCommand(params);
            const lambdaClient = await this.awsClient.getLambdaClient();
            const invokeStart = Date.now();
            const result = await lambdaClient.send(command, {
                abortSignal: AbortSignal.timeout(timeoutMs)
            });
            const invokeDurationMs = Date.now() - invokeStart;
            const parsedResult = result.Payload ? JSON.parse(result.Payload.transformToString()) : {};
            const { logs, initDurationMs, billedDurationMs: awsBilledDurationMs, reportDurationMs, coldStart } = (0, _parselambdalogresultutil.parseLambdaLogResult)(result.LogResult);
            const duration = Date.now() - invokeFlowStart;
            this.logger.log(`[lambda-timing] fnId=${flatLogicFunction.id} executionMode=${executionMode} totalMs=${Date.now() - buildStart} buildExecutorMs=${buildExecutorMs} getBuiltCodeMs=${getBuiltCodeMs} payloadBytes=${Buffer.byteLength(payloadString, 'utf8')} invokeDurationMs=${invokeDurationMs} reportDurationMs=${reportDurationMs ?? 'n/a'} awsBilledDurationMs=${awsBilledDurationMs ?? 'n/a'} initDurationMs=${initDurationMs ?? 'n/a'} coldStart=${coldStart}`);
            if (result.FunctionError) {
                return {
                    data: null,
                    duration,
                    billedDurationMs: invokeDurationMs,
                    status: _logicfunctionexecutionresultdto.LogicFunctionExecutionStatus.ERROR,
                    error: parsedResult,
                    logs
                };
            }
            return {
                data: parsedResult,
                logs,
                duration,
                billedDurationMs: invokeDurationMs,
                status: _logicfunctionexecutionresultdto.LogicFunctionExecutionStatus.SUCCESS
            };
        } catch (error) {
            const phaseTiming = `phase=${currentPhase} buildMs=${buildExecutorMs} fetchCodeMs=${getBuiltCodeMs}`;
            const isTimeoutError = error instanceof Error && error.name === 'TimeoutError';
            if (isTimeoutError && currentPhase === _lambdadrivertype.LambdaExecutionPhase.INVOKE) {
                // User-level outcome (function ran too long), not a platform error: return, don't throw.
                this.logger.warn(`Logic function '${flatLogicFunction.id}' timed out during invoke [${phaseTiming}]`);
                return (0, _buildlogicfunctiontimeoutresultutil.buildLogicFunctionTimeoutResult)(timeoutMs);
            }
            this.logger.error(`Lambda invocation failed for function ${flatLogicFunction.id} [${phaseTiming}]: ${error instanceof Error ? error.message : String(error)}`, error instanceof Error ? error.stack : undefined);
            if (error instanceof _clientlambda.ResourceNotFoundException) {
                throw new _logicfunctionexception.LogicFunctionException(`Function '${flatLogicFunction.id}' does not exist`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND);
            }
            if (isTimeoutError) {
                // Build/fetch-phase timeouts are platform-side — keep throwing so they reach Sentry.
                const executor = await this.executorManager.getLambdaExecutor(flatLogicFunction).catch(()=>undefined);
                const functionState = executor?.Configuration?.State ?? 'unknown';
                throw new _logicfunctionexception.LogicFunctionException(`Lambda timed out for function '${flatLogicFunction.id}' during ${currentPhase} (functionState=${functionState}, ${phaseTiming})`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_EXECUTION_TIMEOUT);
            }
            if (error instanceof _logicfunctionexception.LogicFunctionException) {
                throw error;
            }
            throw new _logicfunctionexception.LogicFunctionException(`Lambda invocation failed for function '${flatLogicFunction.id}' during ${currentPhase}: ${error instanceof Error ? error.message : 'Unknown error'}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_PLATFORM_EXECUTION_ERROR);
        }
    }
    constructor(options){
        this.logger = new _common.Logger(LambdaDriver.name);
        this.logicFunctionResourceService = options.logicFunctionResourceService;
        this.awsClient = new _lambdaawsclientservice.LambdaAwsClientService(options);
        this.toolFunctions = new _lambdatoolfunctionsservice.LambdaToolFunctionsService(options, this.awsClient);
        this.layerManager = new _lambdalayermanagerservice.LambdaLayerManagerService(options, this.awsClient, this.toolFunctions, options.logicFunctionResourceService, options.sdkClientArchiveService);
        this.executorManager = new _lambdaexecutormanagerservice.LambdaExecutorManagerService(options, this.awsClient, this.layerManager, options.cacheLockService, options.logicFunctionResourceService, options.workspaceCacheService);
    }
};

//# sourceMappingURL=lambda.driver.js.map