"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildRunWorkflowJobOptions", {
    enumerable: true,
    get: function() {
        return buildRunWorkflowJobOptions;
    }
});
const buildRunWorkflowJobOptions = (workflowRunId)=>({
        id: workflowRunId,
        allowDuplicatedPrefixes: true
    });

//# sourceMappingURL=build-run-workflow-job-options.util.js.map