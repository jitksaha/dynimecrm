"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractCodeStepLogicFunctionIdsFromWorkflowSteps", {
    enumerable: true,
    get: function() {
        return extractCodeStepLogicFunctionIdsFromWorkflowSteps;
    }
});
const _guards = require("@sniptt/guards");
const _workflowversionstepexception = require("../../../../common/exceptions/workflow-version-step.exception");
const _workflow = require("twenty-shared/workflow");
const isCodeStepForLogicFunction = (step)=>step.type === _workflow.WorkflowActionType.CODE;
const extractCodeStepLogicFunctionIdsFromWorkflowSteps = (steps)=>[
        ...new Set(steps.filter(isCodeStepForLogicFunction).map((step)=>{
            const logicFunctionId = step.settings.input.logicFunctionId;
            if (!(0, _guards.isNonEmptyString)(logicFunctionId)) {
                throw new _workflowversionstepexception.WorkflowVersionStepException(`CODE step '${step.id}' has no logic function id`, _workflowversionstepexception.WorkflowVersionStepExceptionCode.INVALID_REQUEST);
            }
            return logicFunctionId;
        }))
    ];

//# sourceMappingURL=extract-code-step-logic-function-ids-from-workflow-steps.util.js.map