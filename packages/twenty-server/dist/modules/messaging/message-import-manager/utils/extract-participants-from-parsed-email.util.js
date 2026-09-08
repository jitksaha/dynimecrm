"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractParticipantsFromParsedEmail", {
    enumerable: true,
    get: function() {
        return extractParticipantsFromParsedEmail;
    }
});
const _types = require("twenty-shared/types");
const _buildreplytoparticipantsutil = require("./build-reply-to-participants.util");
const _extractaddressesfromparsedemailutil = require("./extract-addresses-from-parsed-email.util");
const _formataddressobjectasparticipantsutil = require("./format-address-object-as-participants.util");
const extractParticipantsFromParsedEmail = (parsed)=>{
    const addressFields = [
        {
            field: parsed.from,
            role: _types.MessageParticipantRole.FROM
        },
        {
            field: parsed.to,
            role: _types.MessageParticipantRole.TO
        },
        {
            field: parsed.cc,
            role: _types.MessageParticipantRole.CC
        },
        {
            field: parsed.bcc,
            role: _types.MessageParticipantRole.BCC
        }
    ];
    const from = (0, _extractaddressesfromparsedemailutil.extractAddressesFromParsedEmail)(parsed.from)[0];
    const replyTo = (0, _extractaddressesfromparsedemailutil.extractAddressesFromParsedEmail)(parsed.replyTo);
    return [
        ...addressFields.flatMap(({ field, role })=>(0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)((0, _extractaddressesfromparsedemailutil.extractAddressesFromParsedEmail)(field), role)),
        ...(0, _buildreplytoparticipantsutil.buildReplyToParticipants)(replyTo, from)
    ];
};

//# sourceMappingURL=extract-participants-from-parsed-email.util.js.map