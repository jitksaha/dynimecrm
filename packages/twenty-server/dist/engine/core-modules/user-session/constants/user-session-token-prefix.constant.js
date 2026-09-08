// Makes opaque session tokens self-describing so the bearer-token dispatcher
// can route them without attempting JWT verification first.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "USER_SESSION_TOKEN_PREFIX", {
    enumerable: true,
    get: function() {
        return USER_SESSION_TOKEN_PREFIX;
    }
});
const USER_SESSION_TOKEN_PREFIX = 'sess_';

//# sourceMappingURL=user-session-token-prefix.constant.js.map