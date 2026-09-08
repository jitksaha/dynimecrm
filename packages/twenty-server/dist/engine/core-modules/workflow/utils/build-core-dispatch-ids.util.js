"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCoreDispatchIds", {
    enumerable: true,
    get: function() {
        return buildCoreDispatchIds;
    }
});
const _utils = require("twenty-shared/utils");
const buildCoreDispatchIds = ({ coreWorkflowVersionId, workspaceWorkflowVersionId })=>(0, _utils.isDefined)(coreWorkflowVersionId) && (0, _utils.isDefined)(workspaceWorkflowVersionId) ? {
        coreWorkflowVersionId,
        workspaceWorkflowVersionId
    } : {
        coreWorkflowVersionId: null,
        workspaceWorkflowVersionId: null
    };

//# sourceMappingURL=build-core-dispatch-ids.util.js.map