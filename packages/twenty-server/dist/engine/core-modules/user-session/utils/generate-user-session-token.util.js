"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateUserSessionToken", {
    enumerable: true,
    get: function() {
        return generateUserSessionToken;
    }
});
const _crypto = require("crypto");
const _usersessiontokenprefixconstant = require("../constants/user-session-token-prefix.constant");
const generateUserSessionToken = ()=>{
    return `${_usersessiontokenprefixconstant.USER_SESSION_TOKEN_PREFIX}${(0, _crypto.randomBytes)(32).toString('base64url')}`;
};

//# sourceMappingURL=generate-user-session-token.util.js.map