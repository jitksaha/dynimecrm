"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isEncryptedString", {
    enumerable: true,
    get: function() {
        return isEncryptedString;
    }
});
const _secretencryptionconstant = require("../constants/secret-encryption.constant");
const isEncryptedString = (value)=>value.startsWith(_secretencryptionconstant.SECRET_ENCRYPTION_ENVELOPE_PREFIX);

//# sourceMappingURL=is-encrypted-string.util.js.map