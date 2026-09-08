"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCoreWorkflowStatuses", {
    enumerable: true,
    get: function() {
        return computeCoreWorkflowStatuses;
    }
});
const _workflowworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow.workspace-entity");
const computeCoreWorkflowStatuses = ({ hasDraftVersion, hasActiveVersion, hasDeactivatedVersion })=>{
    const statuses = [];
    if (hasDraftVersion) {
        statuses.push(_workflowworkspaceentity.WorkflowStatus.DRAFT);
    }
    if (hasActiveVersion) {
        statuses.push(_workflowworkspaceentity.WorkflowStatus.ACTIVE);
    }
    if (!hasActiveVersion && hasDeactivatedVersion) {
        statuses.push(_workflowworkspaceentity.WorkflowStatus.DEACTIVATED);
    }
    return statuses;
};

//# sourceMappingURL=compute-core-workflow-statuses.util.js.map