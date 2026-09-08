"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveWorkspaceMemberIdForUser", {
    enumerable: true,
    get: function() {
        return resolveWorkspaceMemberIdForUser;
    }
});
const _utils = require("twenty-shared/utils");
const resolveWorkspaceMemberIdForUser = ({ userId, flatWorkspaceMemberMaps })=>{
    const workspaceMemberId = flatWorkspaceMemberMaps.idByUserId[userId];
    if (!(0, _utils.isDefined)(workspaceMemberId)) {
        return null;
    }
    const workspaceMember = flatWorkspaceMemberMaps.byId[workspaceMemberId];
    return (0, _utils.isDefined)(workspaceMember?.deletedAt) ? null : workspaceMemberId;
};

//# sourceMappingURL=resolve-workspace-member-id-for-user.util.js.map