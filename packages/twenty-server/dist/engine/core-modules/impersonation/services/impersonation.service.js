"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImpersonationService", {
    enumerable: true,
    get: function() {
        return ImpersonationService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _authexception = require("../../auth/auth.exception");
const _logintokenservice = require("../../auth/token/services/login-token.service");
const _jwttokentypeenum = require("../../auth/types/jwt-token-type.enum");
const _workspacedomainsservice = require("../../domain/workspace-domains/services/workspace-domains.service");
const _eventlogemitterservice = require("../../event-logs/emit/event-log-emitter.service");
const _impersonation = require("../../event-logs/emit/events/workspace-event/impersonation/impersonation");
const _impersonationdenialbyreasonconstant = require("../constants/impersonation-denial-by-reason.constant");
const _impersonationauthorizationservice = require("./impersonation-authorization.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _usersessioncookieservice = require("../../user-session/services/user-session-cookie.service");
const _usersessionservice = require("../../user-session/services/user-session.service");
const _usersessionrevokedreasontype = require("../../user-session/types/user-session-revoked-reason.type");
const _userworkspaceentity = require("../../user-workspace/user-workspace.entity");
const _workspacetype = require("../../workspace/types/workspace.type");
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
let ImpersonationService = class ImpersonationService {
    async impersonate(toImpersonateUserId, workspaceId, impersonatorUserWorkspaceId) {
        const toImpersonateUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId: toImpersonateUserId,
                workspaceId
            },
            relations: [
                'user',
                'workspace'
            ]
        });
        const impersonatorUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                id: impersonatorUserWorkspaceId
            },
            relations: [
                'user',
                'workspace',
                'twoFactorAuthenticationMethods'
            ]
        });
        if (!(0, _utils.isDefined)(toImpersonateUserWorkspace) || !(0, _utils.isDefined)(impersonatorUserWorkspace)) {
            throw new _authexception.AuthException('User not found in workspace or impersonation not enabled', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND);
        }
        if (toImpersonateUserWorkspace.userId === impersonatorUserWorkspace.userId) {
            throw new _authexception.AuthException('User cannot impersonate themselves', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        const authorizationResult = await this.impersonationAuthorizationService.checkImpersonationAuthorization(impersonatorUserWorkspace, toImpersonateUserWorkspace);
        if (!authorizationResult.allowed) {
            const { message, exceptionCode, userFriendlyMessage } = _impersonationdenialbyreasonconstant.IMPERSONATION_DENIAL_BY_REASON[authorizationResult.reason];
            throw new _authexception.AuthException(message, exceptionCode, {
                userFriendlyMessage
            });
        }
        return this.generateImpersonationLoginToken(impersonatorUserWorkspace, toImpersonateUserWorkspace, authorizationResult.level);
    }
    // Hands the impersonator back the session parked when impersonation started.
    // Nothing is minted on the strength of the impersonated user's cookie.
    async stopImpersonation({ impersonationContext, workspaceId, request }) {
        if (!(0, _utils.isDefined)(impersonationContext)) {
            throw new _authexception.AuthException('Not currently impersonating', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
        }
        const impersonatorUserWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                id: impersonationContext.impersonatorUserWorkspaceId
            },
            relations: [
                'user',
                'workspace'
            ]
        });
        if (!(0, _utils.isDefined)(impersonatorUserWorkspace)) {
            throw new _authexception.AuthException('Impersonator user workspace not found', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND);
        }
        const presentedSessionToken = this.userSessionCookieService.extractSessionTokenFromRequest(request);
        if ((0, _utils.isDefined)(presentedSessionToken)) {
            await this.userSessionService.revokeSessionByToken(presentedSessionToken, _usersessionrevokedreasontype.UserSessionRevokedReason.ImpersonationEnded);
        }
        const eventLogContext = this.eventLogEmitterService.createContext({
            workspaceId,
            userId: impersonatorUserWorkspace.userId
        });
        void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
            level: 'workspace',
            action: 'ended',
            message: `Impersonation ended by impersonatorUserWorkspaceId=${impersonationContext.impersonatorUserWorkspaceId}; workspaceId=${workspaceId}`
        });
        if (!(0, _utils.isDefined)(request.res)) {
            return {
                canRestoreImpersonatorSession: false
            };
        }
        const canRestoreImpersonatorSession = await this.restoreImpersonatorSession(request, impersonatorUserWorkspace.id);
        if (!canRestoreImpersonatorSession) {
            this.userSessionCookieService.clearSessionCookie(request.res);
        }
        this.userSessionCookieService.clearImpersonatorSessionCookie(request.res);
        return {
            canRestoreImpersonatorSession
        };
    }
    // The parked token is evidence of nothing on its own, so it is re-resolved
    // and checked against the impersonator the impersonation session names.
    async restoreImpersonatorSession(request, impersonatorUserWorkspaceId) {
        const response = request.res;
        if (!(0, _utils.isDefined)(response)) {
            return false;
        }
        const impersonatorSessionToken = this.userSessionCookieService.extractImpersonatorSessionTokenFromRequest(request);
        if (!(0, _utils.isDefined)(impersonatorSessionToken)) {
            return false;
        }
        try {
            const { payload, expiresAt } = await this.userSessionService.resolveSession(impersonatorSessionToken);
            if (payload.type !== _jwttokentypeenum.JwtTokenTypeEnum.ACCESS || payload.isImpersonating === true || payload.userWorkspaceId !== impersonatorUserWorkspaceId) {
                return false;
            }
            this.userSessionCookieService.attachSessionTokenToResponse(response, impersonatorSessionToken, expiresAt);
            return true;
        } catch  {
            return false;
        }
    }
    async generateImpersonationLoginToken(impersonatorUserWorkspace, toImpersonateUserWorkspace, impersonationLevel) {
        const eventLogContext = this.eventLogEmitterService.createContext({
            workspaceId: impersonatorUserWorkspace.workspace.id,
            userId: impersonatorUserWorkspace.userId
        });
        void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
            level: impersonationLevel,
            action: 'attempt',
            message: `Impersonation attempt: targetUserId=${toImpersonateUserWorkspace.user.id}, workspaceId=${toImpersonateUserWorkspace.workspace.id}, impersonatorUserId=${impersonatorUserWorkspace.user.id}`
        });
        try {
            void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
                level: impersonationLevel,
                action: 'login_token_attempt',
                message: `Impersonation token generation attempt for user ${toImpersonateUserWorkspace.user.id}`
            });
            const loginToken = await this.loginTokenService.generateLoginToken(toImpersonateUserWorkspace.user.email, toImpersonateUserWorkspace.workspace.id, _workspacetype.AuthProviderEnum.Impersonation, {
                impersonatorUserWorkspaceId: impersonatorUserWorkspace.id
            });
            void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
                level: impersonationLevel,
                action: 'login_token_generated',
                message: `Impersonation token generated successfully for user ${toImpersonateUserWorkspace.user.id}`
            });
            return {
                workspace: {
                    id: toImpersonateUserWorkspace.workspace.id,
                    workspaceUrls: this.workspaceDomainsService.getWorkspaceUrls(toImpersonateUserWorkspace.workspace)
                },
                loginToken
            };
        } catch  {
            void eventLogContext.insertWorkspaceEvent(_impersonation.IMPERSONATION_EVENT, {
                level: impersonationLevel,
                action: 'login_token_failed',
                message: `Impersonation token generation failed for targetUserId=${toImpersonateUserWorkspace.user.id}`
            });
            throw new _authexception.AuthException('Impersonation failed', _authexception.AuthExceptionCode.INVALID_DATA);
        }
    }
    constructor(eventLogEmitterService, workspaceDomainsService, loginTokenService, userWorkspaceRepository, impersonationAuthorizationService, twentyConfigService, userSessionService, userSessionCookieService){
        this.eventLogEmitterService = eventLogEmitterService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.loginTokenService = loginTokenService;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.impersonationAuthorizationService = impersonationAuthorizationService;
        this.twentyConfigService = twentyConfigService;
        this.userSessionService = userSessionService;
        this.userSessionCookieService = userSessionCookieService;
    }
};
ImpersonationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _eventlogemitterservice.EventLogEmitterService === "undefined" ? Object : _eventlogemitterservice.EventLogEmitterService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _logintokenservice.LoginTokenService === "undefined" ? Object : _logintokenservice.LoginTokenService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _impersonationauthorizationservice.ImpersonationAuthorizationService === "undefined" ? Object : _impersonationauthorizationservice.ImpersonationAuthorizationService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _usersessionservice.UserSessionService === "undefined" ? Object : _usersessionservice.UserSessionService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService
    ])
], ImpersonationService);

//# sourceMappingURL=impersonation.service.js.map