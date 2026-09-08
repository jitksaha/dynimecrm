"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "verifySvixSignature", {
    enumerable: true,
    get: function() {
        return verifySvixSignature;
    }
});
const _crypto = require("crypto");
const _guards = require("@sniptt/guards");
const SIGNING_SECRET_PREFIX = 'whsec_';
const verifySvixSignature = ({ signingSecret, svixId, svixTimestamp, svixSignature, rawBody })=>{
    const secretKey = Buffer.from(signingSecret.startsWith(SIGNING_SECRET_PREFIX) ? signingSecret.slice(SIGNING_SECRET_PREFIX.length) : signingSecret, 'base64');
    const expectedSignature = (0, _crypto.createHmac)('sha256', secretKey).update(`${svixId}.${svixTimestamp}.${rawBody.toString('utf8')}`).digest();
    return svixSignature.split(' ').map((entry)=>entry.split(',')[1]).filter(_guards.isNonEmptyString).some((candidate)=>{
        const candidateSignature = Buffer.from(candidate, 'base64');
        return candidateSignature.length === expectedSignature.length && (0, _crypto.timingSafeEqual)(candidateSignature, expectedSignature);
    });
};

//# sourceMappingURL=verify-svix-signature.util.js.map