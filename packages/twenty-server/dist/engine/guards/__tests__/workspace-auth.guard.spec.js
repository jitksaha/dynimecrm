"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _graphqlerrorsutil = require("../../core-modules/graphql/utils/graphql-errors.util");
const _runguardedquerytestutil = require("./run-guarded-query.test-util");
const _workspaceauthguard = require("../workspace-auth.guard");
const runQuery = (request)=>(0, _runguardedquerytestutil.runGuardedQuery)({
        guard: _workspaceauthguard.WorkspaceAuthGuard,
        request
    });
describe('WorkspaceAuthGuard', ()=>{
    it('should let a workspace-scoped request through', async ()=>{
        const result = await runQuery({
            user: {
                id: 'user-id'
            },
            workspace: {
                id: 'workspace-id'
            }
        });
        expect(result.errors).toBeUndefined();
        expect(result.data?.guardedQuery).toBe('ok');
    });
    it('should report an unauthenticated request as UNAUTHENTICATED', async ()=>{
        const result = await runQuery({});
        expect(result.errors?.[0]?.extensions?.code).toBe(_graphqlerrorsutil.ErrorCode.UNAUTHENTICATED);
    });
    // Asserted on the exception rather than the code, which the Yoga error handler
    // derives from the HTTP status further down than this harness reaches.
    it('should keep refusing an authenticated request with no workspace', async ()=>{
        const result = await runQuery({
            user: {
                id: 'user-id'
            }
        });
        expect(result.errors?.[0]?.originalError).toBeInstanceOf(_common.ForbiddenException);
        expect(result.errors?.[0]?.message).toBe('Forbidden resource');
    });
    it('should keep refusing an unauthenticated REST request without throwing', ()=>{
        const guard = new _workspaceauthguard.WorkspaceAuthGuard();
        const httpContext = {
            getType: ()=>'http',
            switchToHttp: ()=>({
                    getRequest: ()=>({})
                })
        };
        expect(guard.canActivate(httpContext)).toBe(false);
    });
});

//# sourceMappingURL=workspace-auth.guard.spec.js.map