"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _workspaceauthcontextstorage = require("../../../auth/storage/workspace-auth-context.storage");
const _withresolvedtoolauthcontextutil = require("../with-resolved-tool-auth-context.util");
describe('withResolvedToolAuthContext', ()=>{
    const workspaceId = '20202020-0000-4000-8000-000000000001';
    const userId = '20202020-0000-4000-8000-000000000002';
    const userWorkspaceId = '20202020-0000-4000-8000-000000000003';
    const workspaceMemberId = '20202020-0000-4000-8000-000000000004';
    const buildContext = (overrides)=>({
            workspaceId,
            roleId: 'role-1',
            rolePermissionConfig: {
                unionOf: [
                    'role-1'
                ]
            },
            ...overrides
        });
    const buildDependencies = ()=>({
            userRepository: {
                findOne: jest.fn().mockResolvedValue({
                    id: userId,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'jane@example.com',
                    isEmailVerified: true,
                    disabled: false,
                    canImpersonate: false,
                    canAccessFullAdminPanel: false,
                    locale: 'en',
                    createdAt: new Date('2024-01-01T00:00:00Z'),
                    updatedAt: new Date('2024-01-01T00:00:00Z'),
                    deletedAt: null
                })
            },
            userWorkspaceRepository: {
                findOne: jest.fn().mockResolvedValue({
                    id: userWorkspaceId,
                    userId,
                    workspaceId
                })
            },
            workspaceCacheService: {
                getOrRecompute: jest.fn().mockResolvedValue({
                    flatWorkspaceMemberMaps: {
                        idByUserId: {
                            [userId]: workspaceMemberId
                        },
                        byId: {
                            [workspaceMemberId]: {
                                id: workspaceMemberId,
                                userId
                            }
                        }
                    }
                })
            }
        });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('should expose a built user auth context to the dispatch via async local storage', async ()=>{
        const dependencies = buildDependencies();
        let storeDuringDispatch;
        let contextDuringDispatch;
        await (0, _withresolvedtoolauthcontextutil.withResolvedToolAuthContext)({
            context: buildContext({
                userId,
                userWorkspaceId
            }),
            ...dependencies
        }, async (contextWithAuth)=>{
            storeDuringDispatch = _workspaceauthcontextstorage.workspaceAuthContextStorage.getStore();
            contextDuringDispatch = contextWithAuth;
        });
        expect(dependencies.userRepository.findOne).toHaveBeenCalledWith({
            where: {
                id: userId
            }
        });
        expect(storeDuringDispatch).toMatchObject({
            type: 'user',
            userWorkspaceId,
            workspaceMemberId,
            workspace: {
                id: workspaceId
            }
        });
        expect(contextDuringDispatch?.authContext).toBe(storeDuringDispatch);
    });
    it('should reuse a provided auth context without a user lookup', async ()=>{
        const dependencies = buildDependencies();
        const providedAuthContext = {
            type: 'user',
            workspace: {
                id: workspaceId
            },
            userWorkspaceId,
            workspaceMemberId,
            user: {
                id: userId
            },
            workspaceMember: {
                id: workspaceMemberId
            }
        };
        let storeDuringDispatch;
        await (0, _withresolvedtoolauthcontextutil.withResolvedToolAuthContext)({
            context: buildContext({
                authContext: providedAuthContext
            }),
            ...dependencies
        }, async ()=>{
            storeDuringDispatch = _workspaceauthcontextstorage.workspaceAuthContextStorage.getStore();
        });
        expect(dependencies.userRepository.findOne).not.toHaveBeenCalled();
        expect(storeDuringDispatch).toBe(providedAuthContext);
    });
    it('should run the dispatch outside any auth context when no identity is resolvable', async ()=>{
        const dependencies = buildDependencies();
        const context = buildContext();
        let storeDuringDispatch = null;
        let contextDuringDispatch;
        await (0, _withresolvedtoolauthcontextutil.withResolvedToolAuthContext)({
            context,
            ...dependencies
        }, async (contextWithAuth)=>{
            storeDuringDispatch = _workspaceauthcontextstorage.workspaceAuthContextStorage.getStore();
            contextDuringDispatch = contextWithAuth;
        });
        expect(dependencies.userRepository.findOne).not.toHaveBeenCalled();
        expect(storeDuringDispatch).toBeUndefined();
        expect(contextDuringDispatch).toBe(context);
    });
    it('should not leak the auth context outside the dispatch', async ()=>{
        const dependencies = buildDependencies();
        await (0, _withresolvedtoolauthcontextutil.withResolvedToolAuthContext)({
            context: buildContext({
                userId,
                userWorkspaceId
            }),
            ...dependencies
        }, async ()=>{});
        expect(()=>(0, _workspaceauthcontextstorage.getWorkspaceAuthContext)()).toThrow('Workspace auth context not set');
    });
    it('should return the dispatch result', async ()=>{
        const dependencies = buildDependencies();
        const result = await (0, _withresolvedtoolauthcontextutil.withResolvedToolAuthContext)({
            context: buildContext({
                userId,
                userWorkspaceId
            }),
            ...dependencies
        }, async ()=>({
                success: true
            }));
        expect(result).toEqual({
            success: true
        });
    });
});

//# sourceMappingURL=with-resolved-tool-auth-context.util.spec.js.map