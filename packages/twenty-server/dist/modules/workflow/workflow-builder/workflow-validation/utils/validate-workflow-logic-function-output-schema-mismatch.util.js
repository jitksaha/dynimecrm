"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWorkflowLogicFunctionOutputSchemaMismatch", {
    enumerable: true,
    get: function() {
        return validateWorkflowLogicFunctionOutputSchemaMismatch;
    }
});
const _guards = require("@sniptt/guards");
const _logicfunction = require("twenty-shared/logic-function");
const _utils = require("twenty-shared/utils");
const validateWorkflowLogicFunctionOutputSchemaMismatch = ({ step, declaredOutputSchema })=>{
    const expectedOutputSchema = step.settings?.expectedOutputSchema;
    if (!(0, _utils.isDefined)(declaredOutputSchema) || !(0, _guards.isObject)(expectedOutputSchema) || Object.keys(expectedOutputSchema).length === 0) {
        return [];
    }
    const mismatchIssues = (0, _logicfunction.getOutputSchemaMismatchIssues)(declaredOutputSchema, (0, _logicfunction.getOutputSchemaFromValue)(expectedOutputSchema));
    return mismatchIssues.map((mismatchIssue)=>({
            severity: 'warning',
            code: 'LOGIC_FUNCTION_OUTPUT_SCHEMA_MISMATCH',
            message: `Step "${step.name ?? step.id}" expected output schema does not match the function's declared output schema: ${mismatchIssue}`,
            stepId: step.id
        }));
};

//# sourceMappingURL=validate-workflow-logic-function-output-schema-mismatch.util.js.map