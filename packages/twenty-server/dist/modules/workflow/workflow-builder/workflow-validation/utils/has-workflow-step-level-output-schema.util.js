"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasWorkflowStepLevelOutputSchema", {
    enumerable: true,
    get: function() {
        return hasWorkflowStepLevelOutputSchema;
    }
});
const _hasworkflowoutputschemautil = require("./has-workflow-output-schema.util");
const hasWorkflowStepLevelOutputSchema = (step)=>{
    return (0, _hasworkflowoutputschemautil.hasWorkflowOutputSchema)(step.settings);
};

//# sourceMappingURL=has-workflow-step-level-output-schema.util.js.map