"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveroleidsfromauthcontextutil = require("../resolve-role-ids-from-auth-context.util");
const USER_WORKSPACE_ID = 'user-workspace-1';
const USER_ROLE_ID = 'user-role-1';
const APPLICATION_ROLE_ID = 'application-role-1';
const API_KEY_ID = 'api-key-1';
const API_KEY_ROLE_ID = 'api-key-role-1';
const userWorkspaceRoleMap = {
    [USER_WORKSPACE_ID]: USER_ROLE_ID
};
const apiKeyRoleMap = {
    [API_KEY_ID]: API_KEY_ROLE_ID
};
const buildUserContext = (application)=>({
        type: 'user',
        workspace: {
            id: 'workspace-1'
        },
        userWorkspaceId: USER_WORKSPACE_ID,
        user: {
            id: 'user-1'
        },
        workspaceMemberId: 'workspace-member-1',
        workspaceMember: {
            id: 'workspace-member-1'
        },
        ...application ? {
            application
        } : {}
    });
const resolve = (authContext)=>(0, _resolveroleidsfromauthcontextutil.resolveRoleIdsFromAuthContext)({
        authContext,
        userWorkspaceRoleMap,
        apiKeyRoleMap
    });
describe('resolveRoleIdsFromAuthContext', ()=>{
    it('should resolve the user role alone for a plain user request', ()=>{
        expect(resolve(buildUserContext())).toEqual([
            USER_ROLE_ID
        ]);
    });
    it('should resolve both roles when an application acts on the user behalf', ()=>{
        expect(resolve(buildUserContext({
            defaultRoleId: APPLICATION_ROLE_ID
        }))).toEqual([
            USER_ROLE_ID,
            APPLICATION_ROLE_ID
        ]);
    });
    it('should add no bound when the application declares no role', ()=>{
        expect(resolve(buildUserContext({
            defaultRoleId: null
        }))).toEqual([
            USER_ROLE_ID
        ]);
    });
    it('should resolve the role once when the application declares the user own role', ()=>{
        expect(resolve(buildUserContext({
            defaultRoleId: USER_ROLE_ID
        }))).toEqual([
            USER_ROLE_ID
        ]);
    });
    it('should ignore viaApplication: run-as provenance never narrows permissions', ()=>{
        const runAsContext = {
            ...buildUserContext(),
            viaApplication: {
                defaultRoleId: APPLICATION_ROLE_ID
            }
        };
        expect(resolve(runAsContext)).toEqual([
            USER_ROLE_ID
        ]);
    });
    it('should resolve nothing when the user has no role, even with an application', ()=>{
        const contextWithUnknownUserWorkspace = {
            ...buildUserContext({
                defaultRoleId: APPLICATION_ROLE_ID
            }),
            userWorkspaceId: 'unknown-user-workspace'
        };
        expect(resolve(contextWithUnknownUserWorkspace)).toEqual([]);
    });
    it('should resolve the api key role', ()=>{
        expect(resolve({
            type: 'apiKey',
            workspace: {
                id: 'workspace-1'
            },
            apiKey: {
                id: API_KEY_ID
            }
        })).toEqual([
            API_KEY_ROLE_ID
        ]);
    });
    it('should resolve the application role for an application-only request', ()=>{
        expect(resolve({
            type: 'application',
            workspace: {
                id: 'workspace-1'
            },
            application: {
                defaultRoleId: APPLICATION_ROLE_ID
            }
        })).toEqual([
            APPLICATION_ROLE_ID
        ]);
    });
    it('should resolve nothing for an application-only request with no declared role', ()=>{
        expect(resolve({
            type: 'application',
            workspace: {
                id: 'workspace-1'
            },
            application: {
                defaultRoleId: null
            }
        })).toEqual([]);
    });
    it('should resolve nothing for a system request', ()=>{
        expect(resolve({
            type: 'system',
            workspace: {
                id: 'workspace-1'
            }
        })).toEqual([]);
    });
});

//# sourceMappingURL=resolve-role-ids-from-auth-context.util.spec.js.map