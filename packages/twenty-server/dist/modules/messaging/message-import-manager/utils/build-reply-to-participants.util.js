"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildReplyToParticipants", {
    enumerable: true,
    get: function() {
        return buildReplyToParticipants;
    }
});
const _types = require("twenty-shared/types");
const _formataddressobjectasparticipantsutil = require("./format-address-object-as-participants.util");
const buildReplyToParticipants = (replyTo, from)=>{
    const senderHandle = from?.address?.toLowerCase();
    const replyToExcludingSender = (replyTo ?? []).filter((emailAddress)=>emailAddress.address.toLowerCase() !== senderHandle);
    return (0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)(replyToExcludingSender, _types.MessageParticipantRole.REPLY_TO);
};

//# sourceMappingURL=build-reply-to-participants.util.js.map