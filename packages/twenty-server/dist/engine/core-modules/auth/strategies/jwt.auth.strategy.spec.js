"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _crypto = require("crypto");
const _authexception = require("../auth.exception");
const _jwttokentypeenum = require("../types/jwt-token-type.enum");
const _impersonationauthorizationservice = require("../../impersonation/services/impersonation-authorization.service");
const _nodeenvironmentinterface = require("../../twenty-config/interfaces/node-environment.interface");
const _workspaceentity = require("../../workspace/workspace.entity");
const _workspace = require("twenty-shared/workspace");
const _jwtauthstrategy = require("./jwt.auth.strategy");
describe('JwtAuthStrategy', ()=>{
    let strategy;
    let userWorkspaceRepository;
    let jwtWrapperService;
    let permissionsService;
    let twentyConfigService;
    let workspaceCacheService;
    let coreEntityCacheService;
    let workspaceRepository;
    const jwt = {
        sub: 'sub-default',
        jti: 'jti-default'
    };
    let workspaceStore;
    let userStore;
    let applicationStore;
    let apiKeyStore;
    beforeEach(()=>{
        workspaceStore = {};
        userStore = {};
        applicationStore = {};
        apiKeyStore = {};
        userWorkspaceRepository = {
            findOne: jest.fn()
        };
        workspaceRepository = {
            findOne: jest.fn()
        };
        jwtWrapperService = {
            extractJwtFromRequest: jest.fn(()=>()=>'token'),
            resolveVerificationKey: jest.fn(async ()=>({
                    key: 'mock-key',
                    algorithm: 'HS256'
                }))
        };
        permissionsService = {
            userHasWorkspaceSettingPermission: jest.fn()
        };
        twentyConfigService = {
            get: jest.fn((key)=>key === 'NODE_ENV' ? _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT : undefined)
        };
        workspaceCacheService = {
            getOrRecompute: jest.fn(async (workspaceId, cacheKeys)=>{
                const result = {};
                if (cacheKeys.includes('flatWorkspaceMemberMaps')) {
                    result.flatWorkspaceMemberMaps = {
                        byId: {
                            'workspace-member-id': {
                                id: 'workspace-member-id',
                                userId: 'valid-user-id',
                                workspaceId: 'workspace-id',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                deletedAt: null
                            }
                        },
                        idByUserId: {
                            'valid-user-id': 'workspace-member-id'
                        }
                    };
                }
                if (cacheKeys.includes('flatApplicationMaps')) {
                    result.flatApplicationMaps = {
                        byId: applicationStore[workspaceId] ?? {}
                    };
                }
                if (cacheKeys.includes('apiKeyMap')) {
                    result.apiKeyMap = apiKeyStore[workspaceId] ?? {};
                }
                return result;
            })
        };
        coreEntityCacheService = {
            get: jest.fn(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return userWorkspaceRepository.findOne({
                        where: {
                            id: entityId
                        }
                    });
                }
                return null;
            }),
            invalidate: jest.fn()
        };
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    const createStrategy = ()=>new _jwtauthstrategy.JwtAuthStrategy(jwtWrapperService, userWorkspaceRepository, workspaceCacheService, coreEntityCacheService, new _impersonationauthorizationservice.ImpersonationAuthorizationService(permissionsService, twentyConfigService), workspaceRepository);
    describe('API_KEY validation', ()=>{
        it('should throw AuthException if type is API_KEY and workspace is not found', async ()=>{
            const payload = {
                ...jwt,
                type: _jwttokentypeenum.JwtTokenTypeEnum.API_KEY
            };
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND));
        });
        it('should throw AuthExceptionCode if type is API_KEY not found', async ()=>{
            const payload = {
                ...jwt,
                type: _jwttokentypeenum.JwtTokenTypeEnum.API_KEY
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = 'workspace-id';
            workspaceStore[payload.sub] = mockWorkspace;
            apiKeyStore['workspace-id'] = {};
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('This API Key is revoked', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should throw AuthExceptionCode if API_KEY is revoked', async ()=>{
            const payload = {
                ...jwt,
                type: _jwttokentypeenum.JwtTokenTypeEnum.API_KEY
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = 'workspace-id';
            workspaceStore[payload.sub] = mockWorkspace;
            apiKeyStore['workspace-id'] = {
                [payload.jti]: {
                    id: 'api-key-id',
                    revokedAt: new Date()
                }
            };
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('This API Key is revoked', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should be truthy if type is API_KEY and API_KEY is not revoked', async ()=>{
            const payload = {
                ...jwt,
                type: _jwttokentypeenum.JwtTokenTypeEnum.API_KEY
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = 'workspace-id';
            workspaceStore[payload.sub] = mockWorkspace;
            apiKeyStore['workspace-id'] = {
                [payload.jti]: {
                    id: 'api-key-id',
                    revokedAt: null
                }
            };
            strategy = createStrategy();
            const result = await strategy.validate(payload);
            expect(result).toBeTruthy();
            expect(result.apiKey?.id).toBe('api-key-id');
        });
    });
    describe('ACCESS token validation', ()=>{
        it('should throw AuthExceptionCode if type is ACCESS, no jti, and user not found', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId
            };
            workspaceStore[validWorkspaceId] = new _workspaceentity.WorkspaceEntity();
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('User or user workspace not found', expect.any(String), {
                userFriendlyMessage: /*i18n*/ {
                    id: "l9dlVi",
                    message: "User does not have access to this workspace"
                }
            }));
            try {
                await strategy.validate(payload);
            } catch (e) {
                expect(e.code).toBe(_authexception.AuthExceptionCode.USER_NOT_FOUND);
            }
        });
        it('should throw AuthExceptionCode if type is ACCESS, no jti, and userWorkspace not found', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId
            };
            workspaceStore[validWorkspaceId] = new _workspaceentity.WorkspaceEntity();
            userStore[validUserId] = {
                lastName: 'lastNameDefault'
            };
            userWorkspaceRepository.findOne.mockResolvedValue(null);
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('User or user workspace not found', expect.any(String), {
                userFriendlyMessage: /*i18n*/ {
                    id: "l9dlVi",
                    message: "User does not have access to this workspace"
                }
            }));
            try {
                await strategy.validate(payload);
            } catch (e) {
                expect(e.code).toBe(_authexception.AuthExceptionCode.USER_NOT_FOUND);
            }
        });
        it('should not throw if type is ACCESS, no jti, and user and userWorkspace exist', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId
            };
            workspaceStore[validWorkspaceId] = new _workspaceentity.WorkspaceEntity();
            userStore[validUserId] = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        user: {
                            id: validUserId,
                            lastName: 'lastNameDefault'
                        },
                        workspace: {
                            id: validWorkspaceId
                        }
                    };
                }
                return null;
            });
            strategy = createStrategy();
            const user = await strategy.validate(payload);
            expect(user.user?.lastName).toBe('lastNameDefault');
            expect(user.userWorkspaceId).toBe(validUserWorkspaceId);
        });
        it('should reject when the user workspace belongs to a different workspace than the token', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const tokenWorkspaceId = (0, _crypto.randomUUID)();
            const otherWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: tokenWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = tokenWorkspaceId;
            workspaceStore[tokenWorkspaceId] = mockWorkspace;
            userStore[validUserId] = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: otherWorkspaceId,
                        user: {
                            id: validUserId
                        },
                        workspace: {
                            id: otherWorkspaceId
                        }
                    };
                }
                return null;
            });
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('User or user workspace not found', expect.any(String), {
                userFriendlyMessage: /*i18n*/ {
                    id: "l9dlVi",
                    message: "User does not have access to this workspace"
                }
            }));
        });
    });
    describe('APPLICATION_ACCESS token validation', ()=>{
        it('should allow a cleanup token when its exact workspace deletion is pending', async ()=>{
            const applicationId = (0, _crypto.randomUUID)();
            const workspaceId = (0, _crypto.randomUUID)();
            const workspaceDeletedAt = new Date('2026-08-18T10:00:00.000Z');
            const workspace = Object.assign(new _workspaceentity.WorkspaceEntity(), {
                id: workspaceId,
                createdAt: new Date('2026-08-01T10:00:00.000Z'),
                updatedAt: new Date('2026-08-18T10:00:00.000Z'),
                deletedAt: workspaceDeletedAt
            });
            const application = {
                id: applicationId
            };
            workspaceRepository.findOne.mockResolvedValue(workspace);
            applicationStore[workspaceId] = {
                [applicationId]: application
            };
            strategy = createStrategy();
            await expect(strategy.validate({
                sub: applicationId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS,
                applicationId,
                workspaceId,
                workspaceDeletionRequestTimestamp: workspaceDeletedAt.toISOString()
            })).resolves.toMatchObject({
                application,
                workspace: {
                    id: workspaceId,
                    deletedAt: workspaceDeletedAt.toISOString()
                },
                tokenType: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS
            });
        });
        it('should reject a cleanup token when it belongs to a different deletion request', async ()=>{
            const applicationId = (0, _crypto.randomUUID)();
            const workspaceId = (0, _crypto.randomUUID)();
            workspaceStore[workspaceId] = Object.assign(new _workspaceentity.WorkspaceEntity(), {
                id: workspaceId,
                deletedAt: null
            });
            workspaceRepository.findOne.mockResolvedValue(Object.assign(new _workspaceentity.WorkspaceEntity(), {
                id: workspaceId,
                createdAt: new Date('2026-08-01T10:00:00.000Z'),
                updatedAt: new Date('2026-08-18T10:00:00.000Z'),
                deletedAt: new Date('2026-08-18T10:00:00.000Z')
            }));
            strategy = createStrategy();
            await expect(strategy.validate({
                sub: applicationId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS,
                applicationId,
                workspaceId,
                workspaceDeletionRequestTimestamp: '2026-08-17T10:00:00.000Z'
            })).rejects.toMatchObject({
                code: _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION,
                message: 'Workspace deletion request not found'
            });
            expect(workspaceRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: workspaceId
                },
                withDeleted: true
            });
        });
        it('should throw AuthExceptionCode if type is APPLICATION_ACCESS, and application not found', async ()=>{
            const validApplicationId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validApplicationId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS,
                applicationId: validApplicationId,
                workspaceId: validWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Application not found', expect.any(String), {
                userFriendlyMessage: /*i18n*/ {
                    id: "ltvmAF",
                    message: "Application not found."
                }
            }));
            try {
                await strategy.validate(payload);
            } catch (e) {
                expect(e.code).toBe(_authexception.AuthExceptionCode.APPLICATION_NOT_FOUND);
            }
        });
        it('should reject an application token bound to a user that cannot be resolved', async ()=>{
            const validApplicationId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const removedUserId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validApplicationId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS,
                applicationId: validApplicationId,
                workspaceId: validWorkspaceId,
                userId: removedUserId,
                userWorkspaceId: (0, _crypto.randomUUID)()
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            applicationStore[validWorkspaceId] = {
                [validApplicationId]: {
                    id: validApplicationId
                }
            };
            strategy = createStrategy();
            try {
                await strategy.validate(payload);
                throw new Error('Expected validate to reject');
            } catch (e) {
                expect(e.code).toBe(_authexception.AuthExceptionCode.USER_NOT_FOUND);
            }
        });
        it('should reject an application token whose user is no longer a workspace member', async ()=>{
            const validApplicationId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const validUserId = (0, _crypto.randomUUID)();
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validApplicationId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS,
                applicationId: validApplicationId,
                workspaceId: validWorkspaceId,
                userId: validUserId,
                userWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.activationStatus = _workspace.WorkspaceActivationStatus.ACTIVE;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            applicationStore[validWorkspaceId] = {
                [validApplicationId]: {
                    id: validApplicationId
                }
            };
            userStore[validUserId] = {
                id: validUserId
            };
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: {
                            id: validUserId
                        },
                        workspace: {
                            id: validWorkspaceId
                        }
                    };
                }
                return null;
            });
            strategy = createStrategy();
            try {
                await strategy.validate(payload);
                throw new Error('Expected validate to reject');
            } catch (e) {
                expect(e.code).toBe(_authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
            }
        });
        it('should reject an application token whose workspace member is soft-deleted', async ()=>{
            const validApplicationId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const validUserId = (0, _crypto.randomUUID)();
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceMemberId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validApplicationId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS,
                applicationId: validApplicationId,
                workspaceId: validWorkspaceId,
                userId: validUserId,
                userWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.activationStatus = _workspace.WorkspaceActivationStatus.ACTIVE;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            applicationStore[validWorkspaceId] = {
                [validApplicationId]: {
                    id: validApplicationId
                }
            };
            userStore[validUserId] = {
                id: validUserId
            };
            workspaceCacheService.getOrRecompute.mockImplementation(async (workspaceId, cacheKeys)=>{
                const result = {};
                if (cacheKeys.includes('flatWorkspaceMemberMaps')) {
                    result.flatWorkspaceMemberMaps = {
                        byId: {
                            [validWorkspaceMemberId]: {
                                id: validWorkspaceMemberId,
                                userId: validUserId,
                                deletedAt: new Date()
                            }
                        },
                        idByUserId: {
                            [validUserId]: validWorkspaceMemberId
                        }
                    };
                }
                if (cacheKeys.includes('flatApplicationMaps')) {
                    result.flatApplicationMaps = {
                        byId: applicationStore[workspaceId] ?? {}
                    };
                }
                return result;
            });
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: {
                            id: validUserId
                        },
                        workspace: {
                            id: validWorkspaceId
                        }
                    };
                }
                return null;
            });
            strategy = createStrategy();
            try {
                await strategy.validate(payload);
                throw new Error('Expected validate to reject');
            } catch (e) {
                expect(e.code).toBe(_authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
            }
        });
    });
    describe('Impersonation validation', ()=>{
        it('should throw AuthException if impersonation token has missing impersonatorUserWorkspaceId', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userWorkspaceRepository.findOne.mockResolvedValue({
                id: validUserWorkspaceId,
                user: {
                    id: validUserId,
                    lastName: 'lastNameDefault'
                },
                workspace: {
                    id: validWorkspaceId
                }
            });
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Invalid or missing user workspace ID in impersonation token', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should throw AuthException if impersonation token has missing impersonatedUserWorkspaceId', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userWorkspaceRepository.findOne.mockResolvedValue({
                id: validUserWorkspaceId,
                user: {
                    id: validUserId,
                    lastName: 'lastNameDefault'
                },
                workspace: {
                    id: validWorkspaceId
                }
            });
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Invalid or missing user workspace ID in impersonation token', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should throw AuthException if user tries to impersonate themselves', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId: validUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userWorkspaceRepository.findOne.mockResolvedValue({
                id: validUserWorkspaceId,
                user: {
                    id: validUserId,
                    lastName: 'lastNameDefault'
                },
                workspace: {
                    id: validWorkspaceId
                }
            });
            permissionsService.userHasWorkspaceSettingPermission.mockResolvedValue(true);
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('User cannot impersonate themselves', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should throw AuthException if impersonator user workspace not found', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = true;
            const mockUser = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userStore[validUserId] = mockUser;
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: mockUser,
                        workspace: mockWorkspace
                    };
                }
                return null;
            });
            userWorkspaceRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
                id: validUserWorkspaceId,
                user: {
                    id: 'valid-user-id'
                },
                workspace: mockWorkspace
            });
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Invalid impersonation token, cannot find impersonator or impersonated user workspace', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "lUEEso",
                    message: "User workspace not found."
                }
            }));
        });
        it('should throw AuthException if impersonated user workspace not found', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = true;
            const mockUser = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userStore[validUserId] = mockUser;
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: mockUser,
                        workspace: mockWorkspace
                    };
                }
                return null;
            });
            userWorkspaceRepository.findOne.mockResolvedValueOnce(null);
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Invalid impersonation token, cannot find impersonator or impersonated user workspace', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND));
        });
        it('should throw AuthException for server level impersonation without permission', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const differentWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = false;
            const mockUser = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userStore[validUserId] = mockUser;
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: mockUser,
                        workspace: mockWorkspace
                    };
                }
                return null;
            });
            userWorkspaceRepository.findOne.mockResolvedValueOnce({
                id: impersonatorUserWorkspaceId,
                user: {
                    id: 'valid-user-id',
                    canImpersonate: false
                },
                workspace: {
                    id: differentWorkspaceId
                }
            }).mockResolvedValueOnce({
                id: validUserWorkspaceId,
                user: {
                    id: 'valid-user-id'
                },
                workspace: mockWorkspace
            });
            permissionsService.userHasWorkspaceSettingPermission.mockResolvedValue(false);
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Server level impersonation not allowed', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should throw AuthException when no impersonation permissions are granted', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = false;
            const mockUser = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userStore[validUserId] = mockUser;
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: mockUser,
                        workspace: mockWorkspace
                    };
                }
                return null;
            });
            userWorkspaceRepository.findOne.mockResolvedValueOnce({
                id: impersonatorUserWorkspaceId,
                user: {
                    id: 'valid-user-id',
                    canImpersonate: false
                },
                workspace: mockWorkspace
            }).mockResolvedValueOnce({
                id: validUserWorkspaceId,
                user: {
                    id: 'valid-user-id'
                },
                workspace: mockWorkspace
            });
            permissionsService.userHasWorkspaceSettingPermission.mockResolvedValue(false);
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Impersonation not allowed', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should throw AuthException when impersonatedUserWorkspaceId does not match userWorkspaceId', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatedUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = true;
            workspaceStore[validWorkspaceId] = mockWorkspace;
            strategy = createStrategy();
            await expect(strategy.validate(payload)).rejects.toThrow(new _authexception.AuthException('Token user workspace ID does not match impersonated user workspace ID', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION));
        });
        it('should successfully validate workspace level impersonation with permission', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = false;
            const mockUser = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userStore[validUserId] = mockUser;
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: mockUser,
                        workspace: mockWorkspace
                    };
                }
                return null;
            });
            userWorkspaceRepository.findOne.mockResolvedValueOnce({
                id: impersonatorUserWorkspaceId,
                user: {
                    id: 'valid-user-id',
                    canImpersonate: false
                },
                workspace: mockWorkspace
            }).mockResolvedValueOnce({
                id: validUserWorkspaceId,
                user: mockUser,
                workspace: mockWorkspace
            });
            permissionsService.userHasWorkspaceSettingPermission.mockResolvedValue(true);
            strategy = createStrategy();
            const result = await strategy.validate(payload);
            expect(result.user?.lastName).toBe('lastNameDefault');
            expect(result.userWorkspaceId).toBe(validUserWorkspaceId);
            expect(result.impersonationContext).toBeDefined();
            expect(result.impersonationContext?.impersonatorUserWorkspaceId).toBe(impersonatorUserWorkspaceId);
            expect(result.impersonationContext?.impersonatedUserWorkspaceId).toBe(validUserWorkspaceId);
        });
        it('should successfully validate server level impersonation with permission', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const impersonatorUserWorkspaceId = (0, _crypto.randomUUID)();
            const differentWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true,
                impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: validUserWorkspaceId
            };
            const mockWorkspace = new _workspaceentity.WorkspaceEntity();
            mockWorkspace.id = validWorkspaceId;
            mockWorkspace.allowImpersonation = true;
            const mockUser = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            workspaceStore[validWorkspaceId] = mockWorkspace;
            userStore[validUserId] = mockUser;
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        workspaceId: validWorkspaceId,
                        user: mockUser,
                        workspace: mockWorkspace
                    };
                }
                return null;
            });
            userWorkspaceRepository.findOne.mockResolvedValueOnce({
                id: impersonatorUserWorkspaceId,
                user: {
                    id: 'valid-user-id',
                    canImpersonate: true
                },
                workspace: {
                    id: differentWorkspaceId
                }
            }).mockResolvedValueOnce({
                id: validUserWorkspaceId,
                user: mockUser,
                workspace: mockWorkspace
            });
            strategy = createStrategy();
            const result = await strategy.validate(payload);
            expect(result.user?.lastName).toBe('lastNameDefault');
            expect(result.userWorkspaceId).toBe(validUserWorkspaceId);
            expect(result.impersonationContext).toBeDefined();
            expect(result.impersonationContext?.impersonatorUserWorkspaceId).toBe(impersonatorUserWorkspaceId);
            expect(result.impersonationContext?.impersonatedUserWorkspaceId).toBe(validUserWorkspaceId);
        });
    });
    describe('PLAYGROUND token validation', ()=>{
        // PLAYGROUND tokens are access-shaped but must never impersonate.
        it('ignores isImpersonating and resolves first-person', async ()=>{
            const validUserId = 'valid-user-id';
            const validUserWorkspaceId = (0, _crypto.randomUUID)();
            const validWorkspaceId = (0, _crypto.randomUUID)();
            const payload = {
                sub: validUserId,
                type: _jwttokentypeenum.JwtTokenTypeEnum.PLAYGROUND,
                userWorkspaceId: validUserWorkspaceId,
                workspaceId: validWorkspaceId,
                isImpersonating: true
            };
            workspaceStore[validWorkspaceId] = new _workspaceentity.WorkspaceEntity();
            userStore[validUserId] = {
                id: validUserId,
                lastName: 'lastNameDefault'
            };
            coreEntityCacheService.get.mockImplementation(async (keyName, entityId)=>{
                if (keyName === 'workspaceEntity') {
                    return workspaceStore[entityId] ?? null;
                }
                if (keyName === 'user') {
                    return userStore[entityId] ?? null;
                }
                if (keyName === 'userWorkspaceEntity') {
                    return {
                        id: validUserWorkspaceId,
                        user: {
                            id: validUserId,
                            lastName: 'lastNameDefault'
                        },
                        workspace: {
                            id: validWorkspaceId
                        }
                    };
                }
                return null;
            });
            strategy = createStrategy();
            const result = await strategy.validate(payload);
            expect(result.impersonationContext).toBeUndefined();
            expect(result.tokenType).toBe(_jwttokentypeenum.JwtTokenTypeEnum.PLAYGROUND);
            expect(result.userWorkspaceId).toBe(validUserWorkspaceId);
        });
    });
});

//# sourceMappingURL=jwt.auth.strategy.spec.js.map