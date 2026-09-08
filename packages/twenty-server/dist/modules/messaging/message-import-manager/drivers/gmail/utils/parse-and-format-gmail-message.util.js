"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseAndFormatGmailMessage", {
    enumerable: true,
    get: function() {
        return parseAndFormatGmailMessage;
    }
});
const _types = require("twenty-shared/types");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _computemessagedirectionutil = require("./compute-message-direction.util");
const _parsegmailmessageutil = require("./parse-gmail-message.util");
const _buildreplytoparticipantsutil = require("../../../utils/build-reply-to-participants.util");
const _extractmessagebodytextutil = require("../../../utils/extract-message-body-text.util");
const _formataddressobjectasparticipantsutil = require("../../../utils/format-address-object-as-participants.util");
const parseAndFormatGmailMessage = (message, connectedAccount)=>{
    const { id, threadId, internalDate, subject, from, replyTo, to, cc, bcc, headerMessageId, body, isHtml, attachments, deliveredTo, labelIds, messageHeaders } = (0, _parsegmailmessageutil.parseGmailMessage)(message);
    const isDraft = (labelIds ?? []).includes('DRAFT');
    // Gmail may omit the Message-ID header on drafts; synthesize a stable id from
    // the message id so drafts aren't dropped.
    const resolvedHeaderMessageId = headerMessageId ?? (isDraft ? `draft-${id}` : undefined);
    if (!(0, _utils.isDefined)(from) || !(0, _utils.isDefined)(resolvedHeaderMessageId) || !(0, _utils.isDefined)(threadId)) {
        return null;
    }
    const toParticipants = (0, _utils.isNonEmptyArray)(to) ? to : (0, _guards.isNonEmptyString)(deliveredTo) ? [
        {
            address: deliveredTo
        }
    ] : [];
    const participants = [
        ...(0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)([
            from
        ], _types.MessageParticipantRole.FROM),
        ...(0, _buildreplytoparticipantsutil.buildReplyToParticipants)(replyTo, from),
        ...(0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)(toParticipants, _types.MessageParticipantRole.TO),
        ...(0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)(cc, _types.MessageParticipantRole.CC),
        ...(0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)(bcc, _types.MessageParticipantRole.BCC)
    ];
    const hasRecipientParticipant = participants.some((participant)=>participant.role !== _types.MessageParticipantRole.FROM);
    if (!hasRecipientParticipant && !isDraft) {
        return null;
    }
    return {
        externalId: id,
        headerMessageId: resolvedHeaderMessageId,
        subject: subject || '',
        messageThreadExternalId: threadId,
        receivedAt: new Date(parseInt(internalDate)),
        direction: (0, _computemessagedirectionutil.computeMessageDirection)(from.address || '', connectedAccount),
        participants,
        text: (0, _extractmessagebodytextutil.extractMessageBodyText)(isHtml ? {
            html: body
        } : {
            text: body
        }),
        attachments,
        messageFolderExternalIds: labelIds,
        labelIds,
        isDraft,
        messageHeaders
    };
};

//# sourceMappingURL=parse-and-format-gmail-message.util.js.map