"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isencryptedstringutil = require("../is-encrypted-string.util");
describe('isEncryptedString', ()=>{
    it('returns true for a v2-enveloped value', ()=>{
        expect((0, _isencryptedstringutil.isEncryptedString)('enc:v2:0123abcd:cGF5bG9hZA==')).toBe(true);
    });
    it('returns true for any value carrying the enc: prefix (future-proof)', ()=>{
        expect((0, _isencryptedstringutil.isEncryptedString)('enc:v3:future-shape')).toBe(true);
    });
    it('returns false for plaintext input', ()=>{
        expect((0, _isencryptedstringutil.isEncryptedString)('my-plaintext-token')).toBe(false);
    });
    it('returns false for an empty string', ()=>{
        expect((0, _isencryptedstringutil.isEncryptedString)('')).toBe(false);
    });
    it('returns false for legacy unprefixed CTR ciphertext (raw base64)', ()=>{
        // Legacy CTR ciphertext has no envelope prefix and is structurally
        // indistinguishable from arbitrary base64 input. The predicate
        // intentionally returns false for these so callers fall through to
        // the legacy unbranded decrypt path.
        expect((0, _isencryptedstringutil.isEncryptedString)('aGVsbG8gd29ybGQgaW4gYmFzZTY0')).toBe(false);
    });
});

//# sourceMappingURL=is-encrypted-string.util.spec.js.map