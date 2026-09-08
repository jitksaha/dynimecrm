"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isUnsubscribeTokenExpired", {
    enumerable: true,
    get: function() {
        return isUnsubscribeTokenExpired;
    }
});
const _unsubscribetokenmaxagemsconstant = require("../constants/unsubscribe-token-max-age-ms.constant");
const isUnsubscribeTokenExpired = ({ issuedAt, now, maxAgeMs = _unsubscribetokenmaxagemsconstant.UNSUBSCRIBE_TOKEN_MAX_AGE_MS })=>now - issuedAt > maxAgeMs;

//# sourceMappingURL=is-unsubscribe-token-expired.util.js.map