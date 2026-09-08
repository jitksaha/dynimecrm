"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CookieSessionCsrfMiddleware", {
    enumerable: true,
    get: function() {
        return CookieSessionCsrfMiddleware;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _jwtwrapperservice = require("../core-modules/jwt/services/jwt-wrapper.service");
const _twentyconfigservice = require("../core-modules/twenty-config/twenty-config.service");
const _usersessioncookieservice = require("../core-modules/user-session/services/user-session-cookie.service");
const _isrequestoriginallowedutil = require("../core-modules/user-session/utils/is-request-origin-allowed.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const SAFE_METHODS = new Set([
    'GET',
    'HEAD',
    'OPTIONS'
]);
let CookieSessionCsrfMiddleware = class CookieSessionCsrfMiddleware {
    use(request, response, next) {
        if (SAFE_METHODS.has(request.method)) {
            return next();
        }
        // Any other Authorization scheme still falls through to cookie auth, so it
        // must not skip the check.
        if ((0, _guards.isNonEmptyString)(this.jwtWrapperService.extractJwtFromRequest()(request))) {
            return next();
        }
        if (!(0, _utils.isDefined)(this.userSessionCookieService.extractSessionTokenFromRequest(request))) {
            return next();
        }
        const origin = request.headers.origin;
        // Fails closed on a missing Origin: browsers send it on every unsafe
        // request, so its absence is either a non-browser client, which belongs on
        // a Bearer token, or a stripped header we cannot tell from a forgery.
        if ((0, _guards.isNonEmptyString)(origin) && (0, _isrequestoriginallowedutil.isRequestOriginAllowed)({
            origin,
            request,
            twentyConfigService: this.twentyConfigService
        })) {
            return next();
        }
        response.status(403).json({
            statusCode: 403,
            messages: [
                'Request origin is not allowed for cookie-authenticated requests'
            ],
            error: 'CSRF_ORIGIN_MISMATCH'
        });
    }
    constructor(twentyConfigService, userSessionCookieService, jwtWrapperService){
        this.twentyConfigService = twentyConfigService;
        this.userSessionCookieService = userSessionCookieService;
        this.jwtWrapperService = jwtWrapperService;
    }
};
CookieSessionCsrfMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _usersessioncookieservice.UserSessionCookieService === "undefined" ? Object : _usersessioncookieservice.UserSessionCookieService,
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService
    ])
], CookieSessionCsrfMiddleware);

//# sourceMappingURL=cookie-session-csrf.middleware.js.map