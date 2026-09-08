"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkspaceDeletionPending", {
    enumerable: true,
    get: function() {
        return isWorkspaceDeletionPending;
    }
});
const _utils = require("twenty-shared/utils");
const isWorkspaceDeletionPending = (workspace)=>(0, _utils.isDefined)(workspace) && (0, _utils.isDefined)(workspace.deletedAt);

//# sourceMappingURL=is-workspace-deletion-pending.util.js.map