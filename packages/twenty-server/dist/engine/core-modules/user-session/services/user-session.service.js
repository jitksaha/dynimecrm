"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSessionService", {
    enumerable: true,
    get: function() {
        return UserSessionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _datefns = require("date-fns");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _apptokenentity = require("../../app-token/app-token.entity");
const _authexception = require("../../auth/auth.exception");
const _jwttokentypeenum = require("../../auth/types/jwt-token-type.enum");
const _cachestoragedecorator = require("../../cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../cache-storage/types/cache-storage-namespace.enum");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _authsession = require("../../event-logs/emit/events/workspace-event/auth-session/auth-session");
const _jwtwrapperservice = require("../../jwt/services/jwt-wrapper.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _usersessionentity = require("../user-session.entity");
const _usersessionrevokedreasontype = require("../types/user-session-revoked-reason.type");
const _usersessioncookieservice = require("./user-session-cookie.service");
const _isrequestoriginallowedutil = require("../utils/is-request-origin-allowed.util");
const _generateusersessiontokenutil = require("../utils/generate-user-session-token.util");
const _hashusersessiontokenutil = require("../utils/hash-user-session-token.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const USER_SESSION_CACHE_TTL_MS = 60 * 1000;
const USER_SESSION_MAX_TOUCH_INTERVAL_MS = 5 * 60 * 1000;
const IMPERSONATION_SESSION_LIFETIME = '1d';
const buildInvalidSessionException = ()=>new _authexception.AuthException('Session is invalid or has expired.', _authexception.AuthExceptionCode.UNAUTHENTICATED);
let UserSessionService = class UserSessionService {
    async issueSessionForTokenPair({ tokenPair, request, origin }) {
        const response = request.res;
        if (!(0, _utils.isDefined)(response)) {
            throw new Error('Cannot issue a user session without an HTTP response');
        }
        // Cannot live in the CSRF middleware, which cannot know a request is about
        // to issue a cookie.
        if (!this.isRequestAllowedToReceiveSessionCookie(request)) {
            this.logger.warn(`Refused to issue a session cookie to origin ${request.headers.origin}`);
            throw new _authexception.AuthException('Request origin is not allowed to receive a session cookie', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        try {
            const sessionInput = this.buildCreateSessionInputFromTokenPair(tokenPair, request, origin);
            if (!(0, _utils.isDefined)(sessionInput)) {
                throw new _authexception.AuthException('Cannot issue a session from an invalid token pair', _authexception.AuthExceptionCode.UNAUTHENTICATED);
            }
            const presentedSessionToken = this.userSessionCookieService.extractSessionTokenFromRequest(request);
            if ((0, _utils.isDefined)(presentedSessionToken) && origin === 'renewal_bridge') {
                try {
                    const { payload: presentedPayload } = await this.resolveSession(presentedSessionToken);
                    if (this.isSessionScopeMatchingRenewal(presentedPayload, sessionInput)) {
                        return;
                    }
                } catch (error) {
                    if (!(error instanceof _authexception.AuthException) || error.code !== _authexception.AuthExceptionCode.UNAUTHENTICATED) {
                        throw error;
                    }
                }
            }
            // Create the replacement before touching the presented session. If the
            // insert fails, the browser keeps its last working credential.
            const { sessionToken, session } = await this.createSession(sessionInput);
            this.userSessionCookieService.attachSessionTokenToResponse(response, sessionToken, session.expiresAt);
            if (!(0, _utils.isDefined)(presentedSessionToken)) {
                return;
            }
            if (sessionInput.isImpersonating === true) {
                // The one sign-in that must not revoke what it replaces: parking the
                // impersonator's session lets stopImpersonation hand back the credential
                // they already held.
                this.userSessionCookieService.attachImpersonatorSessionTokenToResponse(response, presentedSessionToken);
                return;
            }
            try {
                await this.revokeSessionByToken(presentedSessionToken, _usersessionrevokedreasontype.UserSessionRevokedReason.Superseded);
            } catch (error) {
                // The replacement session and cookie are already valid. A cleanup
                // failure must not turn that successful handoff into another logout.
                this.logger.error(`Failed to revoke the superseded session: ${error instanceof Error ? error.message : String(error)}`);
            }
        } catch (error) {
            this.logger.error(`Failed to issue a required session: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    // No Origin means no browser to plant a cookie in, so scripted sign-ins keep
    // working. Browsers always send one on the unsafe requests these arrive as.
    isRequestAllowedToReceiveSessionCookie(request) {
        const origin = request.headers.origin;
        if (!(0, _guards.isNonEmptyString)(origin)) {
            return true;
        }
        return (0, _isrequestoriginallowedutil.isRequestOriginAllowed)({
            origin,
            request,
            twentyConfigService: this.twentyConfigService
        });
    }
    isSessionScopeMatchingRenewal(presentedPayload, sessionInput) {
        if (presentedPayload.type !== _jwttokentypeenum.JwtTokenTypeEnum.ACCESS) {
            return presentedPayload.userId === sessionInput.userId && !(0, _utils.isDefined)(sessionInput.workspaceId) && sessionInput.isImpersonating !== true;
        }
        return presentedPayload.userId === sessionInput.userId && (presentedPayload.workspaceId ?? null) === (sessionInput.workspaceId ?? null) && presentedPayload.isImpersonating === true === (sessionInput.isImpersonating === true) && (presentedPayload.userWorkspaceId ?? null) === (sessionInput.userWorkspaceId ?? null) && (presentedPayload.impersonatorUserWorkspaceId ?? null) === (sessionInput.impersonatorUserWorkspaceId ?? null) && (presentedPayload.impersonatedUserWorkspaceId ?? null) === (sessionInput.impersonatedUserWorkspaceId ?? null);
    }
    buildCreateSessionInputFromTokenPair(tokenPair, request, origin) {
        const payload = this.jwtWrapperService.decode(tokenPair.accessOrWorkspaceAgnosticToken.token, {
            json: true
        });
        if (!(0, _utils.isDefined)(payload)) {
            return undefined;
        }
        const requestMetadata = {
            userAgent: request.headers['user-agent'] ?? null,
            ipAddress: request.ip ?? null
        };
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.ACCESS) {
            return {
                userId: payload.userId ?? payload.sub,
                workspaceId: payload.workspaceId,
                userWorkspaceId: payload.userWorkspaceId,
                authProvider: payload.authProvider,
                isImpersonating: payload.isImpersonating === true,
                impersonatorUserWorkspaceId: payload.impersonatorUserWorkspaceId,
                impersonatedUserWorkspaceId: payload.impersonatedUserWorkspaceId,
                origin,
                ...requestMetadata
            };
        }
        if (payload.type === _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC) {
            return {
                userId: payload.userId ?? payload.sub,
                authProvider: payload.authProvider,
                origin,
                ...requestMetadata
            };
        }
        return undefined;
    }
    async createSession(input) {
        if ((0, _utils.isDefined)(input.workspaceId) && !(0, _utils.isDefined)(input.userWorkspaceId)) {
            throw new _authexception.AuthException('Cannot create a workspace session without a user workspace', _authexception.AuthExceptionCode.INVALID_INPUT);
        }
        if (!(0, _utils.isDefined)(input.workspaceId) && (0, _utils.isDefined)(input.userWorkspaceId)) {
            throw new _authexception.AuthException('Cannot create a workspace-agnostic session for a user workspace', _authexception.AuthExceptionCode.INVALID_INPUT);
        }
        if (input.isImpersonating === true && (!(0, _utils.isDefined)(input.workspaceId) || !(0, _utils.isDefined)(input.impersonatorUserWorkspaceId) || !(0, _utils.isDefined)(input.impersonatedUserWorkspaceId))) {
            throw new _authexception.AuthException('Cannot create an impersonation session without a workspace and both user workspaces', _authexception.AuthExceptionCode.INVALID_INPUT);
        }
        const lifetime = input.isImpersonating === true ? IMPERSONATION_SESSION_LIFETIME : this.twentyConfigService.get('SESSION_ABSOLUTE_LIFETIME');
        const now = new Date();
        const sessionToken = (0, _generateusersessiontokenutil.generateUserSessionToken)();
        const session = await this.userSessionRepository.save(this.userSessionRepository.create({
            tokenHash: (0, _hashusersessiontokenutil.hashUserSessionToken)(sessionToken),
            userId: input.userId,
            workspaceId: input.workspaceId ?? null,
            userWorkspaceId: input.userWorkspaceId ?? null,
            authProvider: input.authProvider,
            isImpersonating: input.isImpersonating === true,
            impersonatorUserWorkspaceId: input.isImpersonating === true ? input.impersonatorUserWorkspaceId ?? null : null,
            impersonatedUserWorkspaceId: input.isImpersonating === true ? input.impersonatedUserWorkspaceId ?? null : null,
            userAgent: input.userAgent ?? null,
            ipAddress: input.ipAddress ?? null,
            expiresAt: (0, _datefns.addMilliseconds)(now, (0, _ms.default)(lifetime)),
            lastActiveAt: now
        }));
        if (input.origin === 'sign_in' && (0, _utils.isDefined)(session.workspaceId)) {
            this.emitAuthSessionEvent(session, 'user_signed_in');
        }
        return {
            sessionToken,
            session
        };
    }
    async resolveSession(sessionToken) {
        const tokenHash = (0, _hashusersessiontokenutil.hashUserSessionToken)(sessionToken);
        const cachedSession = await this.cacheStorageService.get(tokenHash);
        if ((0, _utils.isDefined)(cachedSession)) {
            if (!this.isCachedSessionActive(cachedSession)) {
                await this.cacheStorageService.del(tokenHash);
                throw buildInvalidSessionException();
            }
            await this.touchSessionIfDue(tokenHash, cachedSession);
            return this.toResolvedSession(cachedSession);
        }
        const session = await this.userSessionRepository.findOneBy({
            tokenHash
        });
        if (!(0, _utils.isDefined)(session) || !this.isSessionActive(session)) {
            throw buildInvalidSessionException();
        }
        const refreshedCachedSession = this.toCachedSession(session);
        const wasCachedByTouch = await this.touchSessionIfDue(tokenHash, refreshedCachedSession);
        if (!wasCachedByTouch) {
            await this.cacheStorageService.set(tokenHash, refreshedCachedSession, USER_SESSION_CACHE_TTL_MS);
            await this.assertNotRevokedAfterCaching(session.id, tokenHash);
        }
        return this.toResolvedSession(refreshedCachedSession);
    }
    toResolvedSession(cachedSession) {
        return {
            payload: this.buildPayloadFromCachedSession(cachedSession),
            authenticatedAt: new Date(cachedSession.authenticatedAt),
            expiresAt: new Date(cachedSession.expiresAt)
        };
    }
    // A revocation racing the write above may have had its cache delete land
    // first, resurrecting the session for a full TTL. Re-checking afterwards
    // closes it: anything committing later deletes what we just wrote.
    async assertNotRevokedAfterCaching(sessionId, tokenHash) {
        const session = await this.userSessionRepository.findOne({
            where: {
                id: sessionId
            },
            select: {
                id: true,
                revokedAt: true
            }
        });
        if (!(0, _utils.isDefined)(session) || (0, _utils.isDefined)(session.revokedAt)) {
            await this.cacheStorageService.del(tokenHash);
            throw buildInvalidSessionException();
        }
    }
    async findSessionByToken(sessionToken) {
        return this.userSessionRepository.findOneBy({
            tokenHash: (0, _hashusersessiontokenutil.hashUserSessionToken)(sessionToken)
        });
    }
    // Scoped to one workspace: a session belongs to the workspace its exchange
    // selected, and the same person's membership of another workspace is not that
    // workspace's business. Sessions with no workspace are the workspace-agnostic
    // ones minted on the default subdomain, which belong to no workspace's list.
    async findActiveSessionsForUserWorkspace({ userId, workspaceId }) {
        const now = new Date();
        const idleTimeoutMs = this.getIdleTimeoutMs();
        return this.userSessionRepository.find({
            where: {
                userId,
                workspaceId,
                revokedAt: (0, _typeorm1.IsNull)(),
                expiresAt: (0, _typeorm1.MoreThan)(now),
                lastActiveAt: (0, _typeorm1.MoreThan)((0, _datefns.addMilliseconds)(now, -idleTimeoutMs))
            },
            order: {
                lastActiveAt: 'DESC'
            }
        });
    }
    async revokeSessionByToken(sessionToken, reason) {
        const session = await this.findSessionByToken(sessionToken);
        if (!(0, _utils.isDefined)(session)) {
            return false;
        }
        return await this.revokeSessionEntity(session, reason);
    }
    async revokeSessionByIdForUserWorkspace({ sessionId, userId, workspaceId, reason }) {
        const session = await this.userSessionRepository.findOneBy({
            id: sessionId,
            userId,
            workspaceId
        });
        if (!(0, _utils.isDefined)(session)) {
            throw new _authexception.AuthException('Session not found', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        return await this.revokeSessionEntity(session, reason);
    }
    // workspaceId narrows this to one workspace, which is what the settings panel
    // wants. Account-wide callers (password change) leave it out on purpose.
    async revokeAllSessionsForUser({ userId, workspaceId, reason, exceptSessionId }) {
        // Applying the predicate in the UPDATE rather than to ids read beforehand
        // narrows but does not close the window: a sign-in committing after this
        // statement's snapshot survives, which would need a generation counter.
        const revokingQuery = this.userSessionRepository.createQueryBuilder().update(_usersessionentity.UserSessionEntity).set({
            revokedAt: new Date(),
            revokedReason: reason
        }).where('"userId" = :userId', {
            userId
        }).andWhere('"revokedAt" IS NULL');
        if ((0, _utils.isDefined)(workspaceId)) {
            revokingQuery.andWhere('"workspaceId" = :workspaceId', {
                workspaceId
            });
        }
        if ((0, _utils.isDefined)(exceptSessionId)) {
            revokingQuery.andWhere('"id" != :exceptSessionId', {
                exceptSessionId
            });
        }
        const { raw } = await revokingQuery.returning([
            'id',
            'tokenHash',
            'userId',
            'workspaceId',
            'authProvider'
        ]).execute();
        const revokedSessions = raw;
        if (revokedSessions.length === 0) {
            return 0;
        }
        for (const revokedSession of revokedSessions){
            this.emitAuthSessionEvent(revokedSession, 'session_revoked');
        }
        await this.cacheStorageService.mdel(revokedSessions.map((revokedSession)=>revokedSession.tokenHash));
        return revokedSessions.length;
    }
    async signOut({ sessionToken, refreshToken }) {
        try {
            if ((0, _guards.isNonEmptyString)(sessionToken)) {
                await this.revokeSessionByToken(sessionToken, _usersessionrevokedreasontype.UserSessionRevokedReason.UserSignOut);
            }
        } finally{
            if ((0, _guards.isNonEmptyString)(refreshToken)) {
                await this.revokePresentedRefreshToken(refreshToken);
            }
        }
    }
    async revokePresentedRefreshToken(refreshToken) {
        let payload;
        try {
            await this.jwtWrapperService.verifyJwtToken(refreshToken);
            payload = this.jwtWrapperService.decode(refreshToken, {
                json: true
            });
        } catch  {
            return;
        }
        if (payload?.type !== _jwttokentypeenum.JwtTokenTypeEnum.REFRESH || !(0, _guards.isNonEmptyString)(payload.jti)) {
            return;
        }
        // Outside the catch: a storage failure here leaves a usable refresh token
        // behind, so it must surface rather than report success.
        await this.appTokenRepository.update({
            id: payload.jti,
            type: _apptokenentity.AppTokenType.RefreshToken,
            revokedAt: (0, _typeorm1.IsNull)()
        }, {
            revokedAt: new Date()
        });
    }
    async revokeSessionEntity(session, reason) {
        const { affected } = await this.userSessionRepository.update({
            id: session.id,
            revokedAt: (0, _typeorm1.IsNull)()
        }, {
            revokedAt: new Date(),
            revokedReason: reason
        });
        await this.cacheStorageService.del(session.tokenHash);
        const wasRevoked = affected === 1;
        if (wasRevoked) {
            this.emitAuthSessionEvent(session, reason === _usersessionrevokedreasontype.UserSessionRevokedReason.UserSignOut ? 'user_signed_out' : 'session_revoked');
        }
        return wasRevoked;
    }
    isSessionActive(session) {
        return !(0, _utils.isDefined)(session.revokedAt) && this.isCachedSessionActive(this.toCachedSession(session));
    }
    isCachedSessionActive(cachedSession) {
        const now = Date.now();
        return new Date(cachedSession.expiresAt).getTime() > now && new Date(cachedSession.lastActiveAt).getTime() + this.getIdleTimeoutMs() > now;
    }
    getIdleTimeoutMs() {
        return (0, _ms.default)(this.twentyConfigService.get('SESSION_IDLE_TIMEOUT'));
    }
    // Must stay well inside the idle timeout, or a continuously active user goes
    // idle between two touches.
    getTouchIntervalMs() {
        return Math.min(USER_SESSION_MAX_TOUCH_INTERVAL_MS, Math.floor(this.getIdleTimeoutMs() / 2));
    }
    async touchSessionIfDue(tokenHash, cachedSession) {
        const now = new Date();
        if (now.getTime() - new Date(cachedSession.lastActiveAt).getTime() < this.getTouchIntervalMs()) {
            return false;
        }
        let affected;
        try {
            ({ affected } = await this.userSessionRepository.update({
                id: cachedSession.sessionId,
                revokedAt: (0, _typeorm1.IsNull)()
            }, {
                lastActiveAt: now
            }));
        } catch (error) {
            this.logger.warn(`Failed to touch session ${cachedSession.sessionId}: ${error instanceof Error ? error.message : String(error)}`);
            return false;
        }
        if (affected === 0) {
            await this.cacheStorageService.del(tokenHash);
            throw buildInvalidSessionException();
        }
        cachedSession.lastActiveAt = now.toISOString();
        await this.cacheStorageService.set(tokenHash, cachedSession, USER_SESSION_CACHE_TTL_MS);
        await this.assertNotRevokedAfterCaching(cachedSession.sessionId, tokenHash);
        return true;
    }
    toCachedSession(session) {
        return {
            sessionId: session.id,
            userId: session.userId,
            workspaceId: session.workspaceId,
            userWorkspaceId: session.userWorkspaceId,
            authProvider: session.authProvider,
            isImpersonating: session.isImpersonating,
            impersonatorUserWorkspaceId: session.impersonatorUserWorkspaceId,
            impersonatedUserWorkspaceId: session.impersonatedUserWorkspaceId,
            expiresAt: session.expiresAt.toISOString(),
            lastActiveAt: session.lastActiveAt.toISOString(),
            authenticatedAt: session.createdAt.toISOString()
        };
    }
    buildPayloadFromCachedSession(cachedSession) {
        if (!(0, _utils.isDefined)(cachedSession.workspaceId)) {
            return {
                sub: cachedSession.userId,
                userId: cachedSession.userId,
                authProvider: cachedSession.authProvider,
                type: _jwttokentypeenum.JwtTokenTypeEnum.WORKSPACE_AGNOSTIC
            };
        }
        if (!(0, _utils.isDefined)(cachedSession.userWorkspaceId)) {
            throw buildInvalidSessionException();
        }
        return {
            sub: cachedSession.userId,
            userId: cachedSession.userId,
            workspaceId: cachedSession.workspaceId,
            userWorkspaceId: cachedSession.userWorkspaceId,
            authProvider: cachedSession.authProvider,
            type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
            isImpersonating: cachedSession.isImpersonating === true,
            impersonatorUserWorkspaceId: cachedSession.isImpersonating === true ? cachedSession.impersonatorUserWorkspaceId ?? undefined : undefined,
            impersonatedUserWorkspaceId: cachedSession.isImpersonating === true ? cachedSession.impersonatedUserWorkspaceId ?? undefined : undefined
        };
    }
    emitAuthSessionEvent(session, action) {
        if (!(0, _utils.isDefined)(session.workspaceId)) {
            return;
        }
        const eventLogContext = this.eventLogEmitterService.createContext({
            workspaceId: session.workspaceId,
            userId: session.userId
        });
        void eventLogContext.insertWorkspaceEvent(_authsession.AUTH_SESSION_EVENT, {
            action,
            message: `sessionId=${session.id}; authProvider=${session.authProvider}`
        });
    }
    constructor(userSessionRepository, appTokenRepository, cacheStorageService, twentyConfigService, jwtWrapperService, eventLogEmitterService, userSessionCookieService){
        this.userSessionRepository = userSessionRepository;
        this.appTokenRepository = appTokenRepository;
        this.cacheStorageService = cacheStorageService;
        this.twentyConfigService = twentyConfigService;
        this.jwtWrapperService = jwtWrapperService;
        this.eventLogEmitterService = eventLogEmitterService;
        this.userSessionCookieService = userSessionCookieService;
        this.logger = new _common.Logger(UserSessionService.name);
    }
};
UserSessionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_usersessionentity.UserSessionEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_apptokenentity.AppTokenEntity)),
    _ts_param(2, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.EngineAuthSession)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService
    ])
], UserSessionService);

//# sourceMappingURL=user-session.service.js.map