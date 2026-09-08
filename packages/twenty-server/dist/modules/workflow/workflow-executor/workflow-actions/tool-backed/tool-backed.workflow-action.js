"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolBackedWorkflowAction", {
    enumerable: true,
    get: function() {
        return ToolBackedWorkflowAction;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _findsteporthrowutil = require("../../utils/find-step-or-throw.util");
let ToolBackedWorkflowAction = class ToolBackedWorkflowAction {
    async preprocessInput(rawInput, _context) {
        return rawInput;
    }
    async postprocessInput(resolvedInput, _workspaceId) {
        return resolvedInput;
    }
    resolveInput(input, context) {
        return (0, _utils.resolveInput)(input, context);
    }
    async execute({ currentStepId, steps, context, runInfo }) {
        const step = (0, _findsteporthrowutil.findStepOrThrow)({
            stepId: currentStepId,
            steps
        });
        this.assertStep(step);
        const rawInput = step.settings.input;
        const preprocessed = await this.preprocessInput(rawInput, context);
        const resolvedInput = await this.postprocessInput(this.resolveInput(preprocessed, context), runInfo.workspaceId);
        const startedAt = Date.now();
        const toolOutput = await this.getTool().execute(resolvedInput, {
            workspaceId: runInfo.workspaceId
        });
        const durationMs = Date.now() - startedAt;
        await this.persistStepLog({
            workflowRunId: runInfo.workflowRunId,
            workspaceId: runInfo.workspaceId,
            stepId: currentStepId,
            input: resolvedInput,
            output: toolOutput,
            durationMs
        });
        return {
            result: toolOutput.result,
            error: toolOutput.error
        };
    }
    async persistStepLog({ workflowRunId, workspaceId, stepId, input, output, durationMs }) {
        try {
            await this.workflowRunStepLogService.setStepLog({
                workflowRunId,
                workspaceId,
                stepId,
                stepLog: this.buildStepLog({
                    input,
                    output,
                    durationMs
                })
            });
        } catch (error) {
            this.logger.warn(`Failed to persist step log for workflowRun=${workflowRunId} step=${stepId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    constructor(loggerName, workflowRunStepLogService){
        this.workflowRunStepLogService = workflowRunStepLogService;
        this.logger = new _common.Logger(loggerName);
    }
};

//# sourceMappingURL=tool-backed.workflow-action.js.map