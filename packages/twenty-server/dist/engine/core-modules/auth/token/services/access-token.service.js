"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AccessTokenService", {
    enumerable: true,
    get: function() {
        return AccessTokenService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _datefns = require("date-fns");
const _ms = /*#__PURE__*/ _interop_require_default(require("ms"));
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _authexception = require("../../auth.exception");
const _jwtauthstrategy = require("../../strategies/jwt.auth.strategy");
const _jwttokentypeenum = require("../../types/jwt-token-type.enum");
const _jwtwrapperservice = require("../../../jwt/services/jwt-wrapper.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _usersessionservice = require("../../../user-session/services/user-session.service");
const _usersessioncookieservice = require("../../../user-session/services/user-session-cookie.service");
const _isusersessiontokenutil = require("../../../user-session/utils/is-user-session-token.util");
const _userworkspaceentity = require("../../../user-workspace/user-workspace.entity");
const _userworkspaceexception = require("../../../user-workspace/user-workspace.exception");
const _userentity = require("../../../user/user.entity");
const _uservalidate = require("../../../user/user.validate");
const _workspaceentity = require("../../../workspace/workspace.entity");
const _workspaceexception = require("../../../workspace/workspace.exception");
const _workspaceormmanager = require("../../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../twenty-orm/utils/build-system-auth-context.util");
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
let AccessTokenService = class AccessTokenService {
    async resolveTokenSubject(userId, workspaceId) {
        const [user, workspace, userWorkspace] = await Promise.all([
            this.userRepository.findOne({
                where: {
                    id: userId
                }
            }),
            this.workspaceRepository.findOne({
                where: {
                    id: workspaceId
                }
            }),
            this.userWorkspaceRepository.findOne({
                where: {
                    userId,
                    workspaceId
                }
            })
        ]);
        _uservalidate.userValidator.assertIsDefinedOrThrow(user, new _authexception.AuthException('User is not found', _authexception.AuthExceptionCode.INVALID_INPUT));
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        (0, _utils.assertIsDefinedOrThrow)(userWorkspace, _userworkspaceexception.UserWorkspaceNotFoundDefaultError);
        let workspaceMemberId;
        if ((0, _workspace.isWorkspaceProvisioned)(workspace)) {
            const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
            workspaceMemberId = await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
                const workspaceMemberRepository = this.workspaceOrmManager.getRepository('workspaceMember', {
                    shouldBypassPermissionChecks: true
                });
                const workspaceMember = await workspaceMemberRepository.findOne({
                    where: {
                        userId: user.id
                    }
                });
                (0, _utils.assertIsDefinedOrThrow)(workspaceMember, new _authexception.AuthException('User is not a member of the workspace', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "pMOjQa",
                        message: "User is not a member of the workspace."
                    }
                }));
                return workspaceMember.id;
            }, authContext);
        }
        return {
            user,
            workspace,
            userWorkspace,
            workspaceMemberId
        };
    }
    async generateAccessToken({ userId, workspaceId, authProvider, isImpersonating, impersonatorUserWorkspaceId, impersonatedUserWorkspaceId }) {
        const expiresIn = this.twentyConfigService.get('ACCESS_TOKEN_EXPIRES_IN');
        const expiresAt = (0, _datefns.addMilliseconds)(new Date().getTime(), (0, _ms.default)(expiresIn));
        const { user, userWorkspace, workspaceMemberId } = await this.resolveTokenSubject(userId, workspaceId);
        const jwtPayload = {
            sub: user.id,
            userId: user.id,
            workspaceId,
            workspaceMemberId,
            userWorkspaceId: userWorkspace.id,
            type: _jwttokentypeenum.JwtTokenTypeEnum.ACCESS,
            authProvider,
            isImpersonating: isImpersonating === true,
            impersonatorUserWorkspaceId: isImpersonating === true ? impersonatorUserWorkspaceId : undefined,
            impersonatedUserWorkspaceId: isImpersonating === true ? impersonatedUserWorkspaceId : undefined
        };
        const token = await this.jwtWrapperService.signAsyncOrThrow(jwtPayload, {
            expiresIn
        });
        return {
            token,
            expiresAt
        };
    }
    async generatePlaygroundToken({ userId, workspaceId, authProvider }) {
        const expiresIn = this.twentyConfigService.get('PLAYGROUND_TOKEN_EXPIRES_IN');
        const expiresAt = (0, _datefns.addMilliseconds)(new Date().getTime(), (0, _ms.default)(expiresIn));
        const { user, userWorkspace, workspaceMemberId } = await this.resolveTokenSubject(userId, workspaceId);
        const jwtPayload = {
            sub: user.id,
            userId: user.id,
            workspaceId,
            workspaceMemberId,
            userWorkspaceId: userWorkspace.id,
            type: _jwttokentypeenum.JwtTokenTypeEnum.PLAYGROUND,
            authProvider
        };
        const token = await this.jwtWrapperService.signAsyncOrThrow(jwtPayload, {
            expiresIn
        });
        return {
            token,
            expiresAt
        };
    }
    async validateToken(token) {
        await this.jwtWrapperService.verifyJwtToken(token);
        const decoded = this.jwtWrapperService.decode(token);
        const context = await this.jwtStrategy.validate(decoded);
        return context;
    }
    async validateTokenByRequest(request) {
        const token = this.jwtWrapperService.extractJwtFromRequest()(request);
        if (token) {
            if ((0, _isusersessiontokenutil.isUserSessionToken)(token)) {
                // Session tokens are cookie-only by design: accepting them as Bearer would
                // reopen the XSS-exfiltration surface cookie sessions close.
                throw new _authexception.AuthException('Session tokens are only accepted from the session cookie', _authexception.AuthExceptionCode.UNAUTHENTICATED);
            }
            return this.validateToken(token);
        }
        const sessionToken = this.userSessionCookieService.extractSessionTokenFromRequest(request);
        if (sessionToken) {
            return this.validateSessionToken(sessionToken);
        }
        throw new _authexception.AuthException('Missing authentication token', _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION);
    }
    async validateSessionToken(sessionToken) {
        const { payload, authenticatedAt } = await this.userSessionService.resolveSession(sessionToken);
        const context = await this.jwtStrategy.validate(payload);
        return {
            ...context,
            workspaceMemberId: context.workspaceMemberId ?? context.workspaceMember?.id,
            authenticatedAt
        };
    }
    constructor(jwtWrapperService, jwtStrategy, twentyConfigService, userRepository, workspaceRepository, workspaceOrmManager, userWorkspaceRepository, userSessionService, userSessionCookieService){
        this.jwtWrapperService = jwtWrapperService;
        this.jwtStrategy = jwtStrategy;
        this.twentyConfigService = twentyConfigService;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.workspaceOrmManager = workspaceOrmManager;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.userSessionService = userSessionService;
        this.userSessionCookieService = userSessionCookieService;
    }
};
AccessTokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(6, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _jwtauthstrategy.JwtAuthStrategy === "undefined" ? Object : _jwtauthstrategy.JwtAuthStrategy,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _usersessionservice.UserSessionService === "undefined" ? Object : _usersessionservice.UserSessionService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService
    ])
], AccessTokenService);

//# sourceMappingURL=access-token.service.js.map