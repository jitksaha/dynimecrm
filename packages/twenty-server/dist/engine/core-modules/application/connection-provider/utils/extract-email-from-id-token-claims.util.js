"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractEmailFromIdTokenClaims", {
    enumerable: true,
    get: function() {
        return extractEmailFromIdTokenClaims;
    }
});
const _decodejwtpayloadutil = require("../../../jwt/utils/decode-jwt-payload.util");
const extractEmailFromIdTokenClaims = (idToken)=>{
    const claims = (0, _decodejwtpayloadutil.decodeJwtPayload)(idToken);
    const email = claims?.email ?? claims?.upn;
    return typeof email === 'string' ? email : null;
};

//# sourceMappingURL=extract-email-from-id-token-claims.util.js.map