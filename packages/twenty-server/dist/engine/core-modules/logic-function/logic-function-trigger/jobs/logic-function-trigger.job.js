"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogicFunctionTriggerJob", {
    enumerable: true,
    get: function() {
        return LogicFunctionTriggerJob;
    }
});
const _common = require("@nestjs/common");
const _logicfunction = require("twenty-shared/logic-function");
const _logicfunctionapplicationretrylimitconstant = require("../constants/logic-function-application-retry-limit.constant");
const _isretryablelogicfunctionexecutionerrorutil = require("../utils/is-retryable-logic-function-execution-error.util");
const _processdecorator = require("../../../message-queue/decorators/process.decorator");
const _processordecorator = require("../../../message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../message-queue/message-queue.constants");
const _logicfunctionexecutorservice = require("../../logic-function-executor/logic-function-executor.service");
const _logicfunctionexception = require("../../../../metadata-modules/logic-function/logic-function.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LogicFunctionTriggerJob = class LogicFunctionTriggerJob {
    async handle(jobData, jobContext) {
        // Jobs enqueued in version <=2.24.x carry arrays, remove this case once those jobs are drained
        const logicFunctionPayloads = Array.isArray(jobData) ? jobData : [
            jobData
        ];
        for (const [payloadIndex, logicFunctionPayload] of logicFunctionPayloads.entries()){
            try {
                const retryCount = logicFunctionPayload.applicationRetryCount ?? 0;
                const maxRetries = Math.min(_logicfunctionapplicationretrylimitconstant.LOGIC_FUNCTION_APPLICATION_RETRY_LIMIT, jobContext.retryLimit);
                const logicFunctionExecutionResult = await this.logicFunctionExecutorService.execute({
                    logicFunctionId: logicFunctionPayload.logicFunctionId,
                    workspaceId: logicFunctionPayload.workspaceId,
                    payload: logicFunctionPayload.payload ?? {},
                    userId: logicFunctionPayload.userId,
                    userWorkspaceId: logicFunctionPayload.userWorkspaceId,
                    retry: {
                        retryCount,
                        maxRetries
                    }
                });
                if ((0, _isretryablelogicfunctionexecutionerrorutil.isRetryableLogicFunctionExecutionError)(logicFunctionExecutionResult.error)) {
                    if (retryCount >= maxRetries) {
                        continue;
                    }
                    const updatedLogicFunctionPayload = {
                        ...logicFunctionPayload,
                        applicationRetryCount: retryCount + 1
                    };
                    await jobContext.updateData(Array.isArray(jobData) ? logicFunctionPayloads.map((payload, index)=>index === payloadIndex ? updatedLogicFunctionPayload : payload) : updatedLogicFunctionPayload);
                    throw new _logicfunction.RetryableLogicFunctionError(logicFunctionExecutionResult.error.errorMessage);
                }
            } catch (error) {
                // A stopped application must not fail the job: failing would make
                // the queue retry an execution that is intentionally blocked.
                if (error instanceof _logicfunctionexception.LogicFunctionException && error.code === _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DISABLED) {
                    continue;
                }
                if (error instanceof _logicfunctionexception.LogicFunctionException && error.code === _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED) {
                    this.logger.warn(`Skipping function ${logicFunctionPayload.logicFunctionId} (workspace ${logicFunctionPayload.workspaceId}): ${error.message}`);
                    continue;
                }
                throw error;
            }
        }
    }
    constructor(logicFunctionExecutorService){
        this.logicFunctionExecutorService = logicFunctionExecutorService;
        this.logger = new _common.Logger(LogicFunctionTriggerJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(LogicFunctionTriggerJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof MessageQueueJobRetryContext === "undefined" ? Object : MessageQueueJobRetryContext
    ]),
    _ts_metadata("design:returntype", Promise)
], LogicFunctionTriggerJob.prototype, "handle", null);
LogicFunctionTriggerJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.logicFunctionQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService
    ])
], LogicFunctionTriggerJob);

//# sourceMappingURL=logic-function-trigger.job.js.map