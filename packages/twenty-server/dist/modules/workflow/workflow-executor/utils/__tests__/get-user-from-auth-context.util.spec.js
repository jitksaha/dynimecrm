"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getuserfromauthcontextutil = require("../get-user-from-auth-context.util");
describe('getUserFromAuthContext', ()=>{
    it('should name the person a run acts on behalf of', ()=>{
        expect((0, _getuserfromauthcontextutil.getUserFromAuthContext)({
            type: 'user',
            workspace: {
                id: 'workspace-1'
            },
            user: {
                id: 'user-1'
            },
            userWorkspaceId: 'user-workspace-1'
        })).toEqual({
            userId: 'user-1',
            userWorkspaceId: 'user-workspace-1'
        });
    });
    it('should name nobody for a run the application owns', ()=>{
        expect((0, _getuserfromauthcontextutil.getUserFromAuthContext)({
            type: 'application',
            workspace: {
                id: 'workspace-1'
            },
            application: {
                id: 'app-1'
            }
        })).toEqual({});
    });
});

//# sourceMappingURL=get-user-from-auth-context.util.spec.js.map