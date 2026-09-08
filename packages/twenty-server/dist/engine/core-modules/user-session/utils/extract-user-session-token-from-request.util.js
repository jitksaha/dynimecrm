"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractUserSessionTokenFromRequestCookie", {
    enumerable: true,
    get: function() {
        return extractUserSessionTokenFromRequestCookie;
    }
});
const _guards = require("@sniptt/guards");
const _isusersessiontokenutil = require("./is-user-session-token.util");
const readCookieValue = (cookieHeader, cookieName)=>{
    for (const cookiePart of cookieHeader.split(';')){
        const separatorIndex = cookiePart.indexOf('=');
        if (separatorIndex === -1) {
            continue;
        }
        if (cookiePart.slice(0, separatorIndex).trim() !== cookieName) {
            continue;
        }
        const value = cookiePart.slice(separatorIndex + 1).trim();
        if ((0, _guards.isNonEmptyString)(value)) {
            return value;
        }
    }
    return undefined;
};
const extractUserSessionTokenFromRequestCookie = (request, { secureCookieName, insecureCookieName, allowInsecureCookieName })=>{
    const cookieHeader = request.headers.cookie;
    if (!(0, _guards.isNonEmptyString)(cookieHeader)) {
        return undefined;
    }
    const token = readCookieValue(cookieHeader, secureCookieName) ?? (allowInsecureCookieName ? readCookieValue(cookieHeader, insecureCookieName) : undefined);
    if (!(0, _guards.isNonEmptyString)(token) || !(0, _isusersessiontokenutil.isUserSessionToken)(token)) {
        return undefined;
    }
    return token;
};

//# sourceMappingURL=extract-user-session-token-from-request.util.js.map