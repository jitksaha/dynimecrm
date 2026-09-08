"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkspaceDeletionRequestPending", {
    enumerable: true,
    get: function() {
        return isWorkspaceDeletionRequestPending;
    }
});
const _isworkspacedeletionpendingutil = require("./is-workspace-deletion-pending.util");
const isWorkspaceDeletionRequestPending = (workspace, workspaceDeletionRequestTimestamp)=>(0, _isworkspacedeletionpendingutil.isWorkspaceDeletionPending)(workspace) && workspace.deletedAt.toISOString() === workspaceDeletionRequestTimestamp;

//# sourceMappingURL=is-workspace-deletion-request-pending.util.js.map