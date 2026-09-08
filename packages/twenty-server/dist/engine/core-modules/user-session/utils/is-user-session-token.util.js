"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isUserSessionToken", {
    enumerable: true,
    get: function() {
        return isUserSessionToken;
    }
});
const _usersessiontokenprefixconstant = require("../constants/user-session-token-prefix.constant");
const isUserSessionToken = (token)=>{
    return token.startsWith(_usersessiontokenprefixconstant.USER_SESSION_TOKEN_PREFIX);
};

//# sourceMappingURL=is-user-session-token.util.js.map