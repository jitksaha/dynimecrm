"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CodeWorkflowAction", {
    enumerable: true,
    get: function() {
        return CodeWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _logicfunctionexecutorservice = require("../../../../../engine/core-modules/logic-function/logic-function-executor/logic-function-executor.service");
const _workflowexecutioncontextservice = require("../../services/workflow-execution-context.service");
const _getuserfromauthcontextutil = require("../../utils/get-user-from-auth-context.util");
const _workflowstepexecutorexception = require("../../exceptions/workflow-step-executor.exception");
const _findsteporthrowutil = require("../../utils/find-step-or-throw.util");
const _isworkflowcodeactionguard = require("./guards/is-workflow-code-action.guard");
const _buildcodesteplogutil = require("./utils/build-code-step-log.util");
const _workflowrunsteplogworkspaceservice = require("../../../workflow-runner/workflow-run/workflow-run-step-log.workspace-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CodeWorkflowAction = class CodeWorkflowAction {
    async execute({ currentStepId, steps, context, runInfo }) {
        const step = (0, _findsteporthrowutil.findStepOrThrow)({
            stepId: currentStepId,
            steps
        });
        if (!(0, _isworkflowcodeactionguard.isWorkflowCodeAction)(step)) {
            throw new _workflowstepexecutorexception.WorkflowStepExecutorException('Step is not a code action', _workflowstepexecutorexception.WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE);
        }
        const workflowActionInput = (0, _utils.resolveInput)(step.settings.input, context);
        const { workspaceId } = runInfo;
        const { authContext } = await this.workflowExecutionContextService.getExecutionContext(runInfo);
        const result = await this.logicFunctionExecutorService.execute({
            logicFunctionId: workflowActionInput.logicFunctionId,
            workspaceId,
            payload: workflowActionInput.logicFunctionInput,
            ...(0, _getuserfromauthcontextutil.getUserFromAuthContext)(authContext)
        });
        await this.persistStepLog({
            workflowRunId: runInfo.workflowRunId,
            workspaceId,
            stepId: currentStepId,
            result
        });
        if (result.error) {
            return {
                error: result.error.errorMessage
            };
        }
        return {
            result: result.data || {}
        };
    }
    async persistStepLog({ workflowRunId, workspaceId, stepId, result }) {
        try {
            await this.workflowRunStepLogService.setStepLog({
                workflowRunId,
                workspaceId,
                stepId,
                stepLog: (0, _buildcodesteplogutil.buildCodeStepLog)(result)
            });
        } catch (error) {
            this.logger.warn(`Failed to persist step log for workflowRun=${workflowRunId} step=${stepId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(logicFunctionExecutorService, workflowExecutionContextService, workflowRunStepLogService){
        this.logicFunctionExecutorService = logicFunctionExecutorService;
        this.workflowExecutionContextService = workflowExecutionContextService;
        this.workflowRunStepLogService = workflowRunStepLogService;
        this.logger = new _common.Logger(CodeWorkflowAction.name);
    }
};
CodeWorkflowAction = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService,
        typeof _workflowexecutioncontextservice.WorkflowExecutionContextService === "undefined" ? Object : _workflowexecutioncontextservice.WorkflowExecutionContextService,
        typeof _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService === "undefined" ? Object : _workflowrunsteplogworkspaceservice.WorkflowRunStepLogWorkspaceService
    ])
], CodeWorkflowAction);

//# sourceMappingURL=code.workflow-action.js.map