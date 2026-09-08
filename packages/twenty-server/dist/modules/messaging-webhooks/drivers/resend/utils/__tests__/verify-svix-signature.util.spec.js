"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _crypto = require("crypto");
const _verifysvixsignatureutil = require("../verify-svix-signature.util");
const SECRET_BYTES = Buffer.from('resend-signing-secret-material');
const SIGNING_SECRET = `whsec_${SECRET_BYTES.toString('base64')}`;
const signPayload = ({ svixId, svixTimestamp, rawBody })=>{
    return (0, _crypto.createHmac)('sha256', SECRET_BYTES).update(`${svixId}.${svixTimestamp}.${rawBody.toString('utf8')}`).digest('base64');
};
describe('verifySvixSignature', ()=>{
    const svixId = 'msg_123';
    const svixTimestamp = '1700000000';
    const rawBody = Buffer.from('{"type":"email.bounced"}');
    it('should accept a signature computed with the whsec_-prefixed secret', ()=>{
        const signature = signPayload({
            svixId,
            svixTimestamp,
            rawBody
        });
        expect((0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret: SIGNING_SECRET,
            svixId,
            svixTimestamp,
            svixSignature: `v1,${signature}`,
            rawBody
        })).toBe(true);
    });
    it('should accept a secret without the whsec_ prefix', ()=>{
        const signature = signPayload({
            svixId,
            svixTimestamp,
            rawBody
        });
        expect((0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret: SECRET_BYTES.toString('base64'),
            svixId,
            svixTimestamp,
            svixSignature: `v1,${signature}`,
            rawBody
        })).toBe(true);
    });
    it('should accept the matching entry among several space-separated signatures', ()=>{
        const signature = signPayload({
            svixId,
            svixTimestamp,
            rawBody
        });
        expect((0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret: SIGNING_SECRET,
            svixId,
            svixTimestamp,
            svixSignature: `v1,${Buffer.from('other').toString('base64')} v1,${signature}`,
            rawBody
        })).toBe(true);
    });
    it('should reject a signature over a different body', ()=>{
        const signature = signPayload({
            svixId,
            svixTimestamp,
            rawBody
        });
        expect((0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret: SIGNING_SECRET,
            svixId,
            svixTimestamp,
            svixSignature: `v1,${signature}`,
            rawBody: Buffer.from('{"type":"tampered"}')
        })).toBe(false);
    });
    it('should reject a signature computed with another secret', ()=>{
        const signature = (0, _crypto.createHmac)('sha256', Buffer.from('other-secret')).update(`${svixId}.${svixTimestamp}.${rawBody.toString('utf8')}`).digest('base64');
        expect((0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret: SIGNING_SECRET,
            svixId,
            svixTimestamp,
            svixSignature: `v1,${signature}`,
            rawBody
        })).toBe(false);
    });
    it('should reject malformed signature headers', ()=>{
        expect((0, _verifysvixsignatureutil.verifySvixSignature)({
            signingSecret: SIGNING_SECRET,
            svixId,
            svixTimestamp,
            svixSignature: 'v1',
            rawBody
        })).toBe(false);
    });
});

//# sourceMappingURL=verify-svix-signature.util.spec.js.map