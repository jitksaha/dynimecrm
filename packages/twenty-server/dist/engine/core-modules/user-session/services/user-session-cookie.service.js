"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserSessionCookieService", {
    enumerable: true,
    get: function() {
        return UserSessionCookieService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _usersessioncookienameconstant = require("../constants/user-session-cookie-name.constant");
const _usersessionimpersonatorcookienameconstant = require("../constants/user-session-impersonator-cookie-name.constant");
const _usersessionimpersonatorsecurecookienameconstant = require("../constants/user-session-impersonator-secure-cookie-name.constant");
const _usersessionsecurecookienameconstant = require("../constants/user-session-secure-cookie-name.constant");
const _extractusersessiontokenfromrequestutil = require("../utils/extract-user-session-token-from-request.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const isHttpsUrl = (url)=>{
    if (!(0, _guards.isNonEmptyString)(url)) {
        return false;
    }
    try {
        return new URL(url).protocol === 'https:';
    } catch  {
        return false;
    }
};
let UserSessionCookieService = class UserSessionCookieService {
    isSecureDeployment() {
        const serverUrl = this.twentyConfigService.get('SERVER_URL');
        const sameSite = this.twentyConfigService.get('AUTH_COOKIE_SAME_SITE');
        // SameSite=None is rejected by browsers without Secure, so it forces it.
        return isHttpsUrl(serverUrl) || sameSite === 'none';
    }
    extractSessionTokenFromRequest(request) {
        return (0, _extractusersessiontokenfromrequestutil.extractUserSessionTokenFromRequestCookie)(request, {
            secureCookieName: _usersessionsecurecookienameconstant.USER_SESSION_SECURE_COOKIE_NAME,
            insecureCookieName: _usersessioncookienameconstant.USER_SESSION_COOKIE_NAME,
            allowInsecureCookieName: !this.isSecureDeployment()
        });
    }
    extractImpersonatorSessionTokenFromRequest(request) {
        return (0, _extractusersessiontokenfromrequestutil.extractUserSessionTokenFromRequestCookie)(request, {
            secureCookieName: _usersessionimpersonatorsecurecookienameconstant.USER_SESSION_IMPERSONATOR_SECURE_COOKIE_NAME,
            insecureCookieName: _usersessionimpersonatorcookienameconstant.USER_SESSION_IMPERSONATOR_COOKIE_NAME,
            allowInsecureCookieName: !this.isSecureDeployment()
        });
    }
    resolveCookieOptions() {
        return {
            httpOnly: true,
            secure: this.isSecureDeployment(),
            sameSite: this.twentyConfigService.get('AUTH_COOKIE_SAME_SITE'),
            path: '/'
        };
    }
    resolveCookieSettings() {
        return {
            cookieName: this.isSecureDeployment() ? _usersessionsecurecookienameconstant.USER_SESSION_SECURE_COOKIE_NAME : _usersessioncookienameconstant.USER_SESSION_COOKIE_NAME,
            options: this.resolveCookieOptions()
        };
    }
    attachSessionTokenToResponse(response, sessionToken, expiresAt) {
        const { cookieName, options } = this.resolveCookieSettings();
        response.cookie(cookieName, sessionToken, {
            ...options,
            expires: expiresAt
        });
    }
    attachImpersonatorSessionTokenToResponse(response, sessionToken) {
        response.cookie(this.isSecureDeployment() ? _usersessionimpersonatorsecurecookienameconstant.USER_SESSION_IMPERSONATOR_SECURE_COOKIE_NAME : _usersessionimpersonatorcookienameconstant.USER_SESSION_IMPERSONATOR_COOKIE_NAME, sessionToken, this.resolveCookieOptions());
    }
    clearImpersonatorSessionCookie(response) {
        const options = this.resolveCookieOptions();
        response.clearCookie(_usersessionimpersonatorsecurecookienameconstant.USER_SESSION_IMPERSONATOR_SECURE_COOKIE_NAME, options);
        response.clearCookie(_usersessionimpersonatorcookienameconstant.USER_SESSION_IMPERSONATOR_COOKIE_NAME, options);
    }
    hasSessionCookie(request) {
        const cookieHeader = request.headers.cookie;
        if (!(0, _guards.isNonEmptyString)(cookieHeader)) {
            return false;
        }
        return [
            _usersessionsecurecookienameconstant.USER_SESSION_SECURE_COOKIE_NAME,
            _usersessioncookienameconstant.USER_SESSION_COOKIE_NAME
        ].some((cookieName)=>cookieHeader.split(';').some((cookiePart)=>cookiePart.trim().startsWith(`${cookieName}=`)));
    }
    clearSessionCookie(response) {
        const { options } = this.resolveCookieSettings();
        // Both names, so an instance that switched to https drops the cookie it
        // issued under the old one.
        response.clearCookie(_usersessionsecurecookienameconstant.USER_SESSION_SECURE_COOKIE_NAME, options);
        response.clearCookie(_usersessioncookienameconstant.USER_SESSION_COOKIE_NAME, options);
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
    }
};
UserSessionCookieService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], UserSessionCookieService);

//# sourceMappingURL=user-session-cookie.service.js.map