"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getjoinableworkspacesfromapprovedaccessdomainsutil = require("../get-joinable-workspaces-from-approved-access-domains.util");
const _workspacediscoverabilitytype = require("../../../workspace/types/workspace-discoverability.type");
describe('getJoinableWorkspacesFromApprovedAccessDomains', ()=>{
    const publicWorkspace = {
        id: 'workspace-1',
        workspaceDiscoverability: _workspacediscoverabilitytype.WorkspaceDiscoverability.PUBLIC
    };
    it('should return public workspaces the user is not already a member of', ()=>{
        expect((0, _getjoinableworkspacesfromapprovedaccessdomainsutil.getJoinableWorkspacesFromApprovedAccessDomains)({
            approvedAccessDomains: [
                {
                    workspace: publicWorkspace
                }
            ],
            alreadyMemberWorkspaceIds: []
        })).toEqual([
            {
                workspace: publicWorkspace
            }
        ]);
    });
    it('should skip approved-domain rows whose workspace did not load (orphaned/soft-deleted)', ()=>{
        expect((0, _getjoinableworkspacesfromapprovedaccessdomainsutil.getJoinableWorkspacesFromApprovedAccessDomains)({
            approvedAccessDomains: [
                {
                    workspace: null
                },
                {
                    workspace: publicWorkspace
                }
            ],
            alreadyMemberWorkspaceIds: []
        })).toEqual([
            {
                workspace: publicWorkspace
            }
        ]);
    });
    it('should skip non-public workspaces', ()=>{
        expect((0, _getjoinableworkspacesfromapprovedaccessdomainsutil.getJoinableWorkspacesFromApprovedAccessDomains)({
            approvedAccessDomains: [
                {
                    workspace: {
                        id: 'workspace-2',
                        workspaceDiscoverability: _workspacediscoverabilitytype.WorkspaceDiscoverability.HIDDEN
                    }
                }
            ],
            alreadyMemberWorkspaceIds: []
        })).toEqual([]);
    });
    it('should skip workspaces the user is already a member of', ()=>{
        expect((0, _getjoinableworkspacesfromapprovedaccessdomainsutil.getJoinableWorkspacesFromApprovedAccessDomains)({
            approvedAccessDomains: [
                {
                    workspace: publicWorkspace
                }
            ],
            alreadyMemberWorkspaceIds: [
                'workspace-1'
            ]
        })).toEqual([]);
    });
});

//# sourceMappingURL=get-joinable-workspaces-from-approved-access-domains.util.spec.js.map