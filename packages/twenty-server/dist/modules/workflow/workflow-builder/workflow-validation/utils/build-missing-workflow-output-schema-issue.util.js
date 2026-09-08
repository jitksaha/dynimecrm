"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMissingWorkflowOutputSchemaIssue", {
    enumerable: true,
    get: function() {
        return buildMissingWorkflowOutputSchemaIssue;
    }
});
const buildMissingWorkflowOutputSchemaIssue = ({ id, name })=>{
    return {
        severity: 'error',
        code: 'CODE_STEP_MISSING_OUTPUT_SCHEMA',
        message: `Step "${name ?? id}" has no output schema. Declare an expected output schema.`,
        stepId: id
    };
};

//# sourceMappingURL=build-missing-workflow-output-schema-issue.util.js.map