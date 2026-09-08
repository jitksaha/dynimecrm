"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthStrategy", {
    enumerable: true,
    get: function() {
        return JwtAuthStrategy;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _typeorm = require("@nestjs/typeorm");
const _passportjwt = require("passport-jwt");
const _coreentitycacheservice = require("../../../core-entity-cache/services/core-entity-cache.service");
const _authexception = require("../auth.exception");
const _jwttokentypeenum = require("../types/jwt-token-type.enum");
const _impersonationdenialbyreasonconstant = require("../../impersonation/constants/impersonation-denial-by-reason.constant");
const _impersonationauthorizationservice = require("../../impersonation/services/impersonation-authorization.service");
const _jwtalgorithmconstant = require("../../jwt/constants/jwt-algorithm.constant");
const _jwtwrapperservice = require("../../jwt/services/jwt-wrapper.service");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _fromworkspaceentitytoflatutil = require("../../workspace/utils/from-workspace-entity-to-flat.util");
const _isworkspacedeletionrequestpendingutil = require("../../workspace/utils/is-workspace-deletion-request-pending.util");
const _workspaceentity = require("../../workspace/workspace.entity");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let JwtAuthStrategy = class JwtAuthStrategy extends (0, _passport.PassportStrategy)(_passportjwt.Strategy, 'jwt') {
    async validateAPIKey(payload) {
        const workspace = await this.coreEntityCacheService.get('workspaceEntity', payload.sub);
        (0, _utils.assertIsDefinedOrThrow)(workspace, new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND));
        const { apiKeyMap } = await this.workspaceCacheService.getOrRecompute(workspace.id, [
            'apiKeyMap'
        ]);
        const apiKey = payload.jti ? apiKeyMap[payload.jti] : undefined;
        if (!apiKey || apiKey.revokedAt) {
            throw new _authexception.AuthException('This API Key is revoked', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        if (new Date(apiKey.expiresAt) < new Date()) {
            throw new _authexception.AuthException('This API Key is expired', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        return {
            apiKey,
            workspace,
            workspaceMemberId: payload.workspaceMemberId
        };
    }
    async validateAccessToken(payload) {
        let user = null;
        let context = {};
        const workspace = await this.coreEntityCacheService.get('workspaceEntity', payload.workspaceId);
        if (!(0, _utils.isDefined)(workspace)) {
            throw new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND);
        }
        // Only ACCESS tokens can carry impersonation; PLAYGROUND is always first-person.
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.ACCESS && payload.isImpersonating === true) {
            context.impersonationContext = await this.validateImpersonation(payload);
        }
        const userId = payload.sub ?? payload.userId;
        if (!userId) {
            throw new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.USER_NOT_FOUND);
        }
        if (!payload.userWorkspaceId) {
            throw new _authexception.AuthException('UserWorkspaceEntity not found', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND);
        }
        const userContext = await this.resolveUserContext({
            userId,
            userWorkspaceId: payload.userWorkspaceId,
            expectedWorkspaceId: workspace.id
        });
        (0, _utils.assertIsDefinedOrThrow)(userContext, new _authexception.AuthException('User or user workspace not found', _authexception.AuthExceptionCode.USER_NOT_FOUND, {
            userFriendlyMessage: /*i18n*/ {
                id: "l9dlVi",
                message: "User does not have access to this workspace"
            }
        }));
        user = userContext.user;
        context = {
            ...context,
            user,
            workspace,
            authProvider: payload.authProvider,
            userWorkspace: userContext.userWorkspace,
            userWorkspaceId: userContext.userWorkspace.id,
            workspaceMemberId: payload.workspaceMemberId
        };
        if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.PENDING_CREATION || workspace.activationStatus === _workspace.WorkspaceActivationStatus.ONGOING_CREATION) {
            return context;
        }
        const { flatWorkspaceMemberMaps } = await this.workspaceCacheService.getOrRecompute(workspace.id, [
            'flatWorkspaceMemberMaps'
        ]);
        const workspaceMemberId = flatWorkspaceMemberMaps.idByUserId[user.id];
        const workspaceMember = (0, _utils.isDefined)(workspaceMemberId) ? flatWorkspaceMemberMaps.byId[workspaceMemberId] : undefined;
        (0, _utils.assertIsDefinedOrThrow)(workspaceMember, new _authexception.AuthException('User is not a member of the workspace', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
            userFriendlyMessage: /*i18n*/ {
                id: "pMOjQa",
                message: "User is not a member of the workspace."
            }
        }));
        return {
            ...context,
            workspaceMember
        };
    }
    async resolveUserContext(params) {
        const user = await this.coreEntityCacheService.get('user', params.userId);
        if (!(0, _utils.isDefined)(user)) {
            return null;
        }
        const userWorkspace = await this.coreEntityCacheService.get('userWorkspaceEntity', params.userWorkspaceId);
        if (!(0, _utils.isDefined)(userWorkspace)) {
            return null;
        }
        if ((0, _utils.isDefined)(params.expectedWorkspaceId) && userWorkspace.workspaceId !== params.expectedWorkspaceId) {
            return null;
        }
        return {
            user,
            userWorkspace
        };
    }
    async validateImpersonation(payload) {
        if (!payload.impersonatorUserWorkspaceId || !payload.impersonatedUserWorkspaceId) {
            throw new _authexception.AuthException('Invalid or missing user workspace ID in impersonation token', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        if (payload.impersonatedUserWorkspaceId !== payload.userWorkspaceId) {
            throw new _authexception.AuthException('Token user workspace ID does not match impersonated user workspace ID', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        if (payload.impersonatedUserWorkspaceId === payload.impersonatorUserWorkspaceId) {
            throw new _authexception.AuthException('User cannot impersonate themselves', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        // Impersonation validation requires relations -- not cached
        const impersonatorUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                id: payload.impersonatorUserWorkspaceId
            },
            relations: [
                'user',
                'workspace',
                'twoFactorAuthenticationMethods'
            ]
        });
        const impersonatedUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                id: payload.impersonatedUserWorkspaceId
            },
            relations: [
                'user',
                'workspace'
            ]
        });
        if (!(0, _utils.isDefined)(impersonatorUserWorkspace) || !(0, _utils.isDefined)(impersonatedUserWorkspace)) {
            throw new _authexception.AuthException('Invalid impersonation token, cannot find impersonator or impersonated user workspace', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND);
        }
        const authorizationResult = await this.impersonationAuthorizationService.checkImpersonationAuthorization(impersonatorUserWorkspace, impersonatedUserWorkspace);
        if (!authorizationResult.allowed) {
            const { message, exceptionCode, userFriendlyMessage } = _impersonationdenialbyreasonconstant.IMPERSONATION_DENIAL_BY_REASON[authorizationResult.reason];
            throw new _authexception.AuthException(message, exceptionCode, {
                userFriendlyMessage
            });
        }
        return {
            impersonatorUserWorkspaceId: payload.impersonatorUserWorkspaceId,
            impersonatedUserWorkspaceId: payload.impersonatedUserWorkspaceId
        };
    }
    async validateWorkspaceAgnosticToken(payload) {
        const user = await this.coreEntityCacheService.get('user', payload.sub);
        (0, _utils.assertIsDefinedOrThrow)(user, new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.USER_NOT_FOUND));
        return {
            user,
            authProvider: payload.authProvider
        };
    }
    async validateApplicationToken(payload) {
        const workspace = await this.resolveWorkspaceForApplicationToken(payload);
        if (!(0, _utils.isDefined)(workspace)) {
            throw new _authexception.AuthException('Workspace not found', _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND);
        }
        const applicationId = payload.sub ?? payload.applicationId;
        const { flatApplicationMaps } = await this.workspaceCacheService.getOrRecompute(workspace.id, [
            'flatApplicationMaps'
        ]);
        const application = flatApplicationMaps.byId[applicationId];
        if (!(0, _utils.isDefined)(application)) {
            throw new _authexception.AuthException('Application not found', _authexception.AuthExceptionCode.APPLICATION_NOT_FOUND);
        }
        const context = {
            application,
            workspace
        };
        if (payload.userId && payload.userWorkspaceId) {
            const userContext = await this.resolveUserContext({
                userId: payload.userId,
                userWorkspaceId: payload.userWorkspaceId,
                expectedWorkspaceId: workspace.id
            });
            (0, _utils.assertIsDefinedOrThrow)(userContext, new _authexception.AuthException('User or user workspace not found', _authexception.AuthExceptionCode.USER_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "l9dlVi",
                    message: "User does not have access to this workspace"
                }
            }));
            context.user = userContext.user;
            context.userWorkspace = userContext.userWorkspace;
            context.userWorkspaceId = userContext.userWorkspace.id;
            if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.PENDING_CREATION || workspace.activationStatus === _workspace.WorkspaceActivationStatus.ONGOING_CREATION) {
                return context;
            }
            const { flatWorkspaceMemberMaps } = await this.workspaceCacheService.getOrRecompute(workspace.id, [
                'flatWorkspaceMemberMaps'
            ]);
            const workspaceMemberId = flatWorkspaceMemberMaps.idByUserId[userContext.user.id];
            const cachedWorkspaceMember = (0, _utils.isDefined)(workspaceMemberId) ? flatWorkspaceMemberMaps.byId[workspaceMemberId] : undefined;
            const workspaceMember = (0, _utils.isDefined)(cachedWorkspaceMember?.deletedAt) ? undefined : cachedWorkspaceMember;
            (0, _utils.assertIsDefinedOrThrow)(workspaceMember, new _authexception.AuthException('User is not a member of the workspace', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
                userFriendlyMessage: /*i18n*/ {
                    id: "pMOjQa",
                    message: "User is not a member of the workspace."
                }
            }));
            context.workspaceMemberId = workspaceMemberId;
            context.workspaceMember = workspaceMember;
        }
        return context;
    }
    async resolveWorkspaceForApplicationToken(payload) {
        if (!(0, _utils.isDefined)(payload.workspaceDeletionRequestTimestamp)) {
            return this.coreEntityCacheService.get('workspaceEntity', payload.workspaceId);
        }
        const deletedWorkspace = await this.workspaceRepository.findOne({
            where: {
                id: payload.workspaceId
            },
            withDeleted: true
        });
        if (!(0, _isworkspacedeletionrequestpendingutil.isWorkspaceDeletionRequestPending)(deletedWorkspace, payload.workspaceDeletionRequestTimestamp)) {
            throw new _authexception.AuthException('Workspace deletion request not found', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        return (0, _fromworkspaceentitytoflatutil.fromWorkspaceEntityToFlat)(deletedWorkspace);
    }
    isLegacyApiKeyPayload(payload) {
        return !payload.type && !('workspaceId' in payload);
    }
    async validate(payload) {
        const context = await this.dispatch(payload);
        return {
            ...context,
            tokenType: this.isLegacyApiKeyPayload(payload) ? _jwttokentypeenum.JwtTokenTypeEnum.API_KEY : payload.type
        };
    }
    async dispatch(payload) {
        // Support legacy api keys
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.API_KEY || this.isLegacyApiKeyPayload(payload)) {
            return await this.validateAPIKey(payload);
        }
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC) {
            return await this.validateWorkspaceAgnosticToken(payload);
        }
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.ACCESS || payload.type === _jwttokentypeenum.JwtTokenTypeEnum.PLAYGROUND) {
            return await this.validateAccessToken(payload);
        }
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.APPLICATION_ACCESS) {
            return await this.validateApplicationToken(payload);
        }
        throw new _authexception.AuthException('Invalid token', _authexception.AuthExceptionCode.INVALID_JWT_TOKEN_TYPE);
    }
    constructor(jwtWrapperService, userWorkspaceRepository, workspaceCacheService, coreEntityCacheService, impersonationAuthorizationService, workspaceRepository){
        const secretOrKeyProvider = (_request, rawJwtToken, done)=>{
            jwtWrapperService.resolveVerificationKey(rawJwtToken).then(({ key })=>done(null, key), (error)=>done(error, undefined));
        };
        super({
            jwtFromRequest: jwtWrapperService.extractJwtFromRequest(),
            ignoreExpiration: false,
            algorithms: [
                ..._jwtalgorithmconstant.JWT_SUPPORTED_VERIFY_ALGORITHMS
            ],
            secretOrKeyProvider
        }), this.jwtWrapperService = jwtWrapperService, this.userWorkspaceRepository = userWorkspaceRepository, this.workspaceCacheService = workspaceCacheService, this.coreEntityCacheService = coreEntityCacheService, this.impersonationAuthorizationService = impersonationAuthorizationService, this.workspaceRepository = workspaceRepository;
    }
};
JwtAuthStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_param(5, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService,
        typeof _impersonationauthorizationservice.ImpersonationAuthorizationService === "undefined" ? Object : _impersonationauthorizationservice.ImpersonationAuthorizationService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], JwtAuthStrategy);

//# sourceMappingURL=jwt.auth.strategy.js.map