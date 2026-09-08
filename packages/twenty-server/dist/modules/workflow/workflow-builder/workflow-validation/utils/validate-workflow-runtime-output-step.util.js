"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateWorkflowRuntimeOutputStep", {
    enumerable: true,
    get: function() {
        return validateWorkflowRuntimeOutputStep;
    }
});
const _hasworkflowstepleveloutputschemautil = require("./has-workflow-step-level-output-schema.util");
const _buildmissingworkflowoutputschemaissueutil = require("./build-missing-workflow-output-schema-issue.util");
const validateWorkflowRuntimeOutputStep = (step)=>{
    if ((0, _hasworkflowstepleveloutputschemautil.hasWorkflowStepLevelOutputSchema)(step)) {
        return [];
    }
    return [
        (0, _buildmissingworkflowoutputschemaissueutil.buildMissingWorkflowOutputSchemaIssue)({
            id: step.id,
            name: step.name
        })
    ];
};

//# sourceMappingURL=validate-workflow-runtime-output-step.util.js.map