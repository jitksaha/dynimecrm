"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveWorkflowTriggerDispatchMode", {
    enumerable: true,
    get: function() {
        return resolveWorkflowTriggerDispatchMode;
    }
});
const _utils = require("twenty-shared/utils");
const resolveWorkflowTriggerDispatchMode = ({ coreWorkflowVersionId, workspaceWorkflowVersionId })=>{
    if ((0, _utils.isDefined)(coreWorkflowVersionId) && (0, _utils.isDefined)(workspaceWorkflowVersionId)) {
        return {
            mode: 'CORE',
            coreWorkflowVersionId,
            workspaceWorkflowVersionId
        };
    }
    if ((0, _utils.isDefined)(coreWorkflowVersionId) || (0, _utils.isDefined)(workspaceWorkflowVersionId)) {
        return {
            mode: 'INCOMPLETE'
        };
    }
    return {
        mode: 'LEGACY'
    };
};

//# sourceMappingURL=resolve-workflow-trigger-dispatch-mode.util.js.map