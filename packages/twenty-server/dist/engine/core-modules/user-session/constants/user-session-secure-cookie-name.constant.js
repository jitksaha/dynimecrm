// __Host- enforces Secure, Path=/ and no Domain attribute at the browser
// level, so the cookie can never be widened to sibling subdomains.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "USER_SESSION_SECURE_COOKIE_NAME", {
    enumerable: true,
    get: function() {
        return USER_SESSION_SECURE_COOKIE_NAME;
    }
});
const USER_SESSION_SECURE_COOKIE_NAME = '__Host-twenty-session';

//# sourceMappingURL=user-session-secure-cookie-name.constant.js.map