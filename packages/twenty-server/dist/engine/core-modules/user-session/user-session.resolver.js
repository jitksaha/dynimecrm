"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSessionResolver", {
    enumerable: true,
    get: function() {
        return UserSessionResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _utils = require("twenty-shared/utils");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _usersessiondto = require("./dtos/user-session.dto");
const _usersessionservice = require("./services/user-session.service");
const _usersessionrevokedreasontype = require("./types/user-session-revoked-reason.type");
const _usersessioncookieservice = require("./services/user-session-cookie.service");
const _hashusersessiontokenutil = require("./utils/hash-user-session-token.util");
const _authuserdecorator = require("../../decorators/auth/auth-user.decorator");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../guards/no-permission.guard");
const _userauthguard = require("../../guards/user-auth.guard");
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
let UserSessionResolver = class UserSessionResolver {
    async currentUserSessions(user, workspace, context) {
        // UserAuthGuard admits workspace-agnostic credentials, which have no
        // workspace to scope to. Nothing is in scope rather than everything.
        if (!(0, _utils.isDefined)(workspace)) {
            return [];
        }
        const sessions = await this.userSessionService.findActiveSessionsForUserWorkspace({
            userId: user.id,
            workspaceId: workspace.id
        });
        const presentedSessionToken = this.userSessionCookieService.extractSessionTokenFromRequest(context.req);
        const presentedTokenHash = (0, _utils.isDefined)(presentedSessionToken) ? (0, _hashusersessiontokenutil.hashUserSessionToken)(presentedSessionToken) : undefined;
        return sessions.map((session)=>this.toUserSessionDTO(session, presentedTokenHash));
    }
    async revokeUserSession(user, workspace, userSessionId, context) {
        if (!(0, _utils.isDefined)(workspace)) {
            return false;
        }
        // Before revoking: afterwards it is no longer active and would not be found.
        const currentSession = await this.resolveCurrentSession({
            request: context.req,
            user,
            workspace
        });
        const revoked = await this.userSessionService.revokeSessionByIdForUserWorkspace({
            sessionId: userSessionId,
            userId: user.id,
            workspaceId: workspace.id,
            reason: _usersessionrevokedreasontype.UserSessionRevokedReason.UserRevoked
        });
        if (revoked && currentSession?.id === userSessionId && (0, _utils.isDefined)(context.req.res)) {
            this.userSessionCookieService.clearSessionCookie(context.req.res);
        }
        return revoked;
    }
    // A revoked or expired cookie must not decide which sessions survive.
    async resolveCurrentSession({ request, user, workspace }) {
        const presentedSessionToken = this.userSessionCookieService.extractSessionTokenFromRequest(request);
        if (!(0, _utils.isDefined)(presentedSessionToken)) {
            return undefined;
        }
        const activeSessions = await this.userSessionService.findActiveSessionsForUserWorkspace({
            userId: user.id,
            workspaceId: workspace.id
        });
        const presentedTokenHash = (0, _hashusersessiontokenutil.hashUserSessionToken)(presentedSessionToken);
        return activeSessions.find((session)=>session.tokenHash === presentedTokenHash);
    }
    async revokeAllOtherUserSessions(user, workspace, context) {
        if (!(0, _utils.isDefined)(workspace)) {
            return 0;
        }
        const currentSession = await this.resolveCurrentSession({
            request: context.req,
            user,
            workspace
        });
        return await this.userSessionService.revokeAllSessionsForUser({
            userId: user.id,
            workspaceId: workspace.id,
            reason: _usersessionrevokedreasontype.UserSessionRevokedReason.UserRevoked,
            exceptSessionId: currentSession?.id
        });
    }
    toUserSessionDTO(session, presentedTokenHash) {
        return {
            id: session.id,
            workspaceId: session.workspaceId,
            authProvider: session.authProvider,
            isImpersonating: session.isImpersonating,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            createdAt: session.createdAt,
            lastActiveAt: session.lastActiveAt,
            expiresAt: session.expiresAt,
            isCurrent: session.tokenHash === presentedTokenHash
        };
    }
    constructor(userSessionService, userSessionCookieService){
        this.userSessionService = userSessionService;
        this.userSessionCookieService = userSessionCookieService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _usersessiondto.UserSessionDTO
        ]),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)({
        allowUndefined: true
    })),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], UserSessionResolver.prototype, "currentUserSessions", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)({
        allowUndefined: true
    })),
    _ts_param(2, (0, _graphql.Args)('userSessionId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(3, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        Object,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], UserSessionResolver.prototype, "revokeUserSession", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_graphql.Int),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _authuserdecorator.AuthUser)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)({
        allowUndefined: true
    })),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContextUser === "undefined" ? Object : AuthContextUser,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], UserSessionResolver.prototype, "revokeAllOtherUserSessions", null);
UserSessionResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersessionservice.UserSessionService === "undefined" ? Object : _usersessionservice.UserSessionService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService
    ])
], UserSessionResolver);

//# sourceMappingURL=user-session.resolver.js.map