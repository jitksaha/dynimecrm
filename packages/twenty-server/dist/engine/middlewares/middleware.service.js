"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MiddlewareService", {
    enumerable: true,
    get: function() {
        return MiddlewareService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _authexception = require("../core-modules/auth/auth.exception");
const _authgraphqlapiexceptionfilter = require("../core-modules/auth/filters/auth-graphql-api-exception.filter");
const _accesstokenservice = require("../core-modules/auth/token/services/access-token.service");
const _getauthexceptionreststatusutil = require("../core-modules/auth/utils/get-auth-exception-rest-status.util");
const _exceptionhandlerservice = require("../core-modules/exception-handler/exception-handler.service");
const _graphqlerrorsutil = require("../core-modules/graphql/utils/graphql-errors.util");
const _jwtwrapperservice = require("../core-modules/jwt/services/jwt-wrapper.service");
const _usersessioncookieservice = require("../core-modules/user-session/services/user-session-cookie.service");
const _workspacemanyorallflatentitymapscacheservice = require("../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _defaulterrormessageconstant = require("./constants/default-error-message.constant");
const _binddatatorequestobjectutil = require("../utils/bind-data-to-request-object.util");
const _globalexceptionhandlerutil = require("../utils/global-exception-handler.util");
const _workspacecachestorageservice = require("../workspace-cache-storage/workspace-cache-storage.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const DEAD_SESSION_COOKIE_EXCEPTION_CODES = new Set([
    _authexception.AuthExceptionCode.UNAUTHENTICATED,
    _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND,
    _authexception.AuthExceptionCode.FORBIDDEN_EXCEPTION,
    _authexception.AuthExceptionCode.USER_NOT_FOUND,
    _authexception.AuthExceptionCode.WORKSPACE_NOT_FOUND
]);
let MiddlewareService = class MiddlewareService {
    isTokenPresent(request) {
        const token = this.jwtWrapperService.extractJwtFromRequest()(request);
        if (token) {
            return true;
        }
        return (0, _utils.isDefined)(this.userSessionCookieService.extractSessionTokenFromRequest(request));
    }
    // oxlint-disable-next-line typescript/no-explicit-any
    writeRestResponseOnExceptionCaught(res, error) {
        const statusCode = this.getStatus(error);
        (0, _globalexceptionhandlerutil.handleException)({
            exception: error,
            exceptionHandlerService: this.exceptionHandlerService,
            statusCode
        });
        res.writeHead(statusCode, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({
            statusCode,
            messages: [
                error?.message || _defaulterrormessageconstant.INTERNAL_SERVER_ERROR
            ],
            error: error?.code || _graphqlerrorsutil.ErrorCode.INTERNAL_SERVER_ERROR
        }));
        res.end();
    }
    // oxlint-disable-next-line typescript/no-explicit-any
    writeGraphqlResponseOnExceptionCaught(res, error) {
        let errors;
        if (error instanceof _authexception.AuthException) {
            try {
                const authFilter = new _authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter();
                authFilter.catch(error);
            } catch (transformedError) {
                errors = [
                    transformedError
                ];
            }
        } else {
            errors = [
                (0, _globalexceptionhandlerutil.handleExceptionAndConvertToGraphQLError)(error, this.exceptionHandlerService)
            ];
        }
        const statusCode = 200;
        res.writeHead(statusCode, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({
            errors
        }));
        res.end();
    }
    async hydrateRestRequest(request) {
        const data = await this.accessTokenService.validateTokenByRequest(request);
        const metadataVersion = data.workspace ? await this.getOrSeedMetadataVersion(data.workspace) : undefined;
        if (!data.workspace) {
            throw new Error('No data sources found');
        }
        if (!(0, _guards.isNonEmptyString)(data.workspace.databaseSchema)) {
            throw new Error('No data sources found');
        }
        (0, _binddatatorequestobjectutil.bindDataToRequestObject)(data, request, metadataVersion);
    }
    clearDeadSessionCookie(request, error) {
        const isCookieAuthenticated = !(0, _guards.isNonEmptyString)(this.jwtWrapperService.extractJwtFromRequest()(request));
        const isDeadCredential = error instanceof _authexception.AuthException && DEAD_SESSION_COOKIE_EXCEPTION_CODES.has(error.code);
        if (!isCookieAuthenticated || !isDeadCredential || !(0, _utils.isDefined)(request.res)) {
            return;
        }
        this.userSessionCookieService.clearSessionCookie(request.res);
    }
    async hydrateGraphqlRequest(request) {
        if (!this.isTokenPresent(request)) {
            request.locale = request.headers['x-locale'] ?? _translations.SOURCE_LOCALE;
            return;
        }
        let data;
        try {
            data = await this.accessTokenService.validateTokenByRequest(request);
        } catch (error) {
            // Clearing is a response side effect, never a reason to swallow: letting
            // the request continue unauthenticated builds the schema without the
            // workspace, so the client gets "Cannot query field" instead of an auth
            // error and never learns its session was revoked.
            this.clearDeadSessionCookie(request, error);
            throw error;
        }
        const metadataVersion = data.workspace ? await this.getOrSeedMetadataVersion(data.workspace) : undefined;
        (0, _binddatatorequestobjectutil.bindDataToRequestObject)(data, request, metadataVersion);
    }
    async getOrSeedMetadataVersion(workspace) {
        const cachedMetadataVersion = await this.workspaceStorageCacheService.getMetadataVersion(workspace.id);
        if ((0, _utils.isDefined)(cachedMetadataVersion)) {
            return cachedMetadataVersion;
        }
        if ((0, _utils.isDefined)(workspace.metadataVersion)) {
            await this.workspaceStorageCacheService.setMetadataVersion(workspace.id, workspace.metadataVersion);
        }
        return workspace.metadataVersion;
    }
    hasErrorStatus(error) {
        return (0, _utils.isDefined)(error?.status);
    }
    // oxlint-disable-next-line typescript/no-explicit-any
    getStatus(error) {
        if (this.hasErrorStatus(error)) {
            return error.status;
        }
        if (error instanceof _authexception.AuthException) {
            return (0, _getauthexceptionreststatusutil.getAuthExceptionRestStatus)(error);
        }
        return 500;
    }
    constructor(accessTokenService, workspaceStorageCacheService, flatEntityMapsCacheService, exceptionHandlerService, jwtWrapperService, userSessionCookieService){
        this.accessTokenService = accessTokenService;
        this.workspaceStorageCacheService = workspaceStorageCacheService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.jwtWrapperService = jwtWrapperService;
        this.userSessionCookieService = userSessionCookieService;
    }
};
MiddlewareService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _accesstokenservice.AccessTokenService === "undefined" ? Object : _accesstokenservice.AccessTokenService,
        typeof _workspacecachestorageservice.WorkspaceCacheStorageService === "undefined" ? Object : _workspacecachestorageservice.WorkspaceCacheStorageService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService
    ])
], MiddlewareService);

//# sourceMappingURL=middleware.service.js.map