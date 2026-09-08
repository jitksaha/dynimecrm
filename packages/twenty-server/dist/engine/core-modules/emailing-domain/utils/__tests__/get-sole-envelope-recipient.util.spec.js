"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getsoleenveloperecipientutil = require("../get-sole-envelope-recipient.util");
describe('getSoleEnvelopeRecipient', ()=>{
    it('should return the single primary recipient', ()=>{
        expect((0, _getsoleenveloperecipientutil.getSoleEnvelopeRecipient)({
            to: [
                'ada@example.com'
            ]
        })).toBe('ada@example.com');
    });
    it('should return null when the envelope carries several primary recipients', ()=>{
        expect((0, _getsoleenveloperecipientutil.getSoleEnvelopeRecipient)({
            to: [
                'ada@example.com',
                'grace@example.com'
            ]
        })).toBeNull();
    });
    it('should return null when a copied recipient would receive the same body', ()=>{
        expect((0, _getsoleenveloperecipientutil.getSoleEnvelopeRecipient)({
            to: [
                'ada@example.com'
            ],
            cc: [
                'grace@example.com'
            ]
        })).toBeNull();
    });
    it('should count blind-copied recipients', ()=>{
        expect((0, _getsoleenveloperecipientutil.getSoleEnvelopeRecipient)({
            to: [
                'ada@example.com'
            ],
            bcc: [
                'grace@example.com'
            ]
        })).toBeNull();
    });
    it('should return null when there is no recipient at all', ()=>{
        expect((0, _getsoleenveloperecipientutil.getSoleEnvelopeRecipient)({
            to: []
        })).toBeNull();
    });
});

//# sourceMappingURL=get-sole-envelope-recipient.util.spec.js.map