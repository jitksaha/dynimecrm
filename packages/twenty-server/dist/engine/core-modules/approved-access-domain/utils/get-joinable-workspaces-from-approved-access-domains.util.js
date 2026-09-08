"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getJoinableWorkspacesFromApprovedAccessDomains", {
    enumerable: true,
    get: function() {
        return getJoinableWorkspacesFromApprovedAccessDomains;
    }
});
const _utils = require("twenty-shared/utils");
const _workspacediscoverabilitytype = require("../../workspace/types/workspace-discoverability.type");
const getJoinableWorkspacesFromApprovedAccessDomains = ({ approvedAccessDomains, alreadyMemberWorkspaceIds })=>{
    return approvedAccessDomains.map((approvedAccessDomain)=>approvedAccessDomain.workspace).filter(_utils.isDefined).filter((workspace)=>workspace.workspaceDiscoverability === _workspacediscoverabilitytype.WorkspaceDiscoverability.PUBLIC && !alreadyMemberWorkspaceIds.includes(workspace.id)).map((workspace)=>({
            workspace
        }));
};

//# sourceMappingURL=get-joinable-workspaces-from-approved-access-domains.util.js.map