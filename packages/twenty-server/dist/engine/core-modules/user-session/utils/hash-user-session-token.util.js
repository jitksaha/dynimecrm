"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hashUserSessionToken", {
    enumerable: true,
    get: function() {
        return hashUserSessionToken;
    }
});
const _crypto = require("crypto");
const hashUserSessionToken = (token)=>{
    return (0, _crypto.createHash)('sha256').update(token).digest('hex');
};

//# sourceMappingURL=hash-user-session-token.util.js.map