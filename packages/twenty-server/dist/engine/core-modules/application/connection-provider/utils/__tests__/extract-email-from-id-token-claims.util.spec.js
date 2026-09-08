"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _jsonwebtoken = /*#__PURE__*/ _interop_require_wildcard(require("jsonwebtoken"));
const _extractemailfromidtokenclaimsutil = require("../extract-email-from-id-token-claims.util");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const GOOGLE_ID_TOKEN_CLAIMS = {
    iss: 'https://accounts.google.com',
    azp: '1234987819200.apps.googleusercontent.com',
    aud: '1234987819200.apps.googleusercontent.com',
    sub: '10769150350006150715113082367',
    at_hash: 'HK6E_P6Dh8Y93mRNtsDB1Q',
    hd: 'example.com',
    email: 'jsmith@example.com',
    email_verified: 'true',
    iat: 1353601026,
    exp: 1353604926,
    nonce: '0394852-3190485-2490358'
};
const MICROSOFT_ENTRA_ID_TOKEN_CLAIMS_WITH_UPN = {
    ver: '1.0',
    iss: 'https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/',
    sub: 'HKZpfaHyWadeOouYlitjrI-KffTm222X1yNTz_c',
    aud: '6e74172b-be56-4843-9ff4-e66a39bb12e3',
    tid: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    oid: '690222be-ff1a-4d56-abd1-7e4f7d38e474',
    upn: 'abeli@microsoft.com',
    unique_name: 'abeli@microsoft.com',
    iat: 1537231048,
    nbf: 1537231048,
    exp: 1537234948
};
describe('extractEmailFromIdTokenClaims', ()=>{
    it('reads the email claim from a Google-shaped id_token', ()=>{
        const idToken = _jsonwebtoken.sign(GOOGLE_ID_TOKEN_CLAIMS, 'test-secret');
        expect((0, _extractemailfromidtokenclaimsutil.extractEmailFromIdTokenClaims)(idToken)).toBe('jsmith@example.com');
    });
    it('falls back to the upn claim on a Microsoft Entra ID-shaped id_token with no email claim', ()=>{
        const idToken = _jsonwebtoken.sign(MICROSOFT_ENTRA_ID_TOKEN_CLAIMS_WITH_UPN, 'test-secret');
        expect((0, _extractemailfromidtokenclaimsutil.extractEmailFromIdTokenClaims)(idToken)).toBe('abeli@microsoft.com');
    });
    it('prefers the email claim over upn when both are present', ()=>{
        const idToken = _jsonwebtoken.sign({
            ...MICROSOFT_ENTRA_ID_TOKEN_CLAIMS_WITH_UPN,
            email: 'abeli-preferred@microsoft.com'
        }, 'test-secret');
        expect((0, _extractemailfromidtokenclaimsutil.extractEmailFromIdTokenClaims)(idToken)).toBe('abeli-preferred@microsoft.com');
    });
    it('returns null when neither email nor upn claims are present', ()=>{
        const idToken = _jsonwebtoken.sign({
            sub: '24400320',
            iss: 'https://server.example.com'
        }, 'test-secret');
        expect((0, _extractemailfromidtokenclaimsutil.extractEmailFromIdTokenClaims)(idToken)).toBeNull();
    });
    it('returns null for a malformed token', ()=>{
        expect((0, _extractemailfromidtokenclaimsutil.extractEmailFromIdTokenClaims)('not-a-jwt')).toBeNull();
    });
});

//# sourceMappingURL=extract-email-from-id-token-claims.util.spec.js.map