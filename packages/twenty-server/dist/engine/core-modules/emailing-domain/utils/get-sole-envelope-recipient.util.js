"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSoleEnvelopeRecipient", {
    enumerable: true,
    get: function() {
        return getSoleEnvelopeRecipient;
    }
});
const getSoleEnvelopeRecipient = ({ to, cc, bcc })=>{
    const recipients = [
        ...to,
        ...cc ?? [],
        ...bcc ?? []
    ];
    return recipients.length === 1 ? recipients[0] : null;
};

//# sourceMappingURL=get-sole-envelope-recipient.util.js.map