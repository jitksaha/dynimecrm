"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveWorkspaceMemberId", {
    enumerable: true,
    get: function() {
        return resolveWorkspaceMemberId;
    }
});
const _utils = require("twenty-shared/utils");
const resolveWorkspaceMemberId = async ({ userWorkspaceId, workspaceId, userWorkspaceRepository, workspaceCacheService })=>{
    const userWorkspace = await userWorkspaceRepository.findOne({
        where: {
            id: userWorkspaceId,
            workspaceId
        }
    });
    if (!(0, _utils.isDefined)(userWorkspace)) {
        return null;
    }
    const { flatWorkspaceMemberMaps } = await workspaceCacheService.getOrRecompute(workspaceId, [
        'flatWorkspaceMemberMaps'
    ]);
    return flatWorkspaceMemberMaps.idByUserId[userWorkspace.userId] ?? null;
};

//# sourceMappingURL=resolve-workspace-member-id.util.js.map