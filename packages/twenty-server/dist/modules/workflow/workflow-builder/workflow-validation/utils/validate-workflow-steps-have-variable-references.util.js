"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWorkflowStepsHaveVariableReferences", {
    enumerable: true,
    get: function() {
        return validateWorkflowStepsHaveVariableReferences;
    }
});
const _workflow = require("twenty-shared/workflow");
const _workflowvariableconsumingactiontypesconstant = require("../constants/workflow-variable-consuming-action-types.constant");
const validateWorkflowStepsHaveVariableReferences = (steps)=>{
    const issues = [];
    for (const step of steps){
        if (!_workflowvariableconsumingactiontypesconstant.WORKFLOW_VARIABLE_CONSUMING_ACTION_TYPES.has(step.type)) {
            continue;
        }
        const variables = (0, _workflow.extractVariablesFromInput)(step.settings?.input);
        if (variables.length > 0) {
            continue;
        }
        issues.push({
            severity: 'warning',
            code: 'STEP_HAS_NO_VARIABLE_REFERENCE',
            message: `Step "${step.name ?? step.id}" does not reference any variable from previous steps.`,
            stepId: step.id
        });
    }
    return issues;
};

//# sourceMappingURL=validate-workflow-steps-have-variable-references.util.js.map