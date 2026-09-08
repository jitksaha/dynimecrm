"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveinboundemailmessagereferenceutil = require("../resolve-inbound-email-message-reference.util");
describe('resolveInboundEmailMessageReference', ()=>{
    it('should pass through source and reference payloads', ()=>{
        expect((0, _resolveinboundemailmessagereferenceutil.resolveInboundEmailMessageReference)({
            source: 'SES_S3',
            reference: 'raw/object-key',
            envelopeRecipients: [
                'ch_abc@groups.example.com'
            ]
        })).toEqual({
            source: 'SES_S3',
            reference: 'raw/object-key'
        });
    });
    it('should normalize legacy s3Key payloads to the SES_S3 source', ()=>{
        expect((0, _resolveinboundemailmessagereferenceutil.resolveInboundEmailMessageReference)({
            s3Key: 'raw/legacy-key',
            envelopeRecipients: [
                'ch_abc@groups.example.com'
            ]
        })).toEqual({
            source: 'SES_S3',
            reference: 'raw/legacy-key'
        });
    });
});

//# sourceMappingURL=resolve-inbound-email-message-reference.util.spec.js.map