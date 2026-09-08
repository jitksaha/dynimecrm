"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkflowRunSource", {
    enumerable: true,
    get: function() {
        return buildWorkflowRunSource;
    }
});
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const DEFAULT_WORKFLOW_NAME = 'Workflow';
const buildWorkflowRunSource = (workflowName)=>{
    const trimmedWorkflowName = workflowName?.trim();
    return {
        source: _types.FieldActorSource.WORKFLOW,
        name: (0, _guards.isNonEmptyString)(trimmedWorkflowName) ? trimmedWorkflowName : DEFAULT_WORKFLOW_NAME,
        context: {},
        workspaceMemberId: null
    };
};

//# sourceMappingURL=build-workflow-run-source.util.js.map