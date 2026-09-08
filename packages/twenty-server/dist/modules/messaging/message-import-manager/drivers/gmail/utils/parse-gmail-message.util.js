"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGmailMessage", {
    enumerable: true,
    get: function() {
        return parseGmailMessage;
    }
});
const _assert = /*#__PURE__*/ _interop_require_default(require("assert"));
const _utils = require("twenty-shared/utils");
const _getattachmentdatautil = require("./get-attachment-data.util");
const _getbodydatautil = require("./get-body-data.util");
const _getpropertyfromheadersutil = require("./get-property-from-headers.util");
const _safeparseemailaddressaddressutil = require("../../../utils/safe-parse-email-address-address.util");
const _safeparseemailaddressesutil = require("../../../utils/safe-parse-email-addresses.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parseGmailMessage = (message)=>{
    const subject = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Subject');
    const rawFrom = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'From');
    const rawReplyTo = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Reply-To');
    const rawTo = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'To');
    const rawDeliveredTo = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Delivered-To');
    const rawCc = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Cc');
    const rawBcc = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Bcc');
    const messageId = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Message-ID');
    const id = message.id;
    const threadId = message.threadId;
    const historyId = message.historyId;
    const internalDate = message.internalDate;
    const labelIds = message.labelIds ?? [];
    const messageHeaders = (message.payload?.headers ?? []).flatMap(({ name, value })=>(0, _utils.isDefined)(name) && (0, _utils.isDefined)(value) ? [
            {
                name,
                value
            }
        ] : []);
    (0, _assert.default)(id, 'ID is missing');
    (0, _assert.default)(historyId, 'History-ID is missing');
    (0, _assert.default)(internalDate, 'Internal date is missing');
    const bodyResult = (0, _getbodydatautil.getBodyData)(message);
    const decodedBody = bodyResult ? Buffer.from(bodyResult.data, 'base64').toString() : '';
    const isHtml = bodyResult?.isHtml ?? false;
    const attachments = (0, _getattachmentdatautil.getAttachmentData)(message);
    return {
        id,
        headerMessageId: messageId,
        threadId,
        historyId,
        internalDate,
        subject,
        from: rawFrom ? (0, _safeparseemailaddressesutil.safeParseEmailAddresses)(rawFrom)[0] : undefined,
        replyTo: rawReplyTo ? (0, _safeparseemailaddressesutil.safeParseEmailAddresses)(rawReplyTo) : [],
        deliveredTo: rawDeliveredTo ? (0, _safeparseemailaddressaddressutil.safeParseEmailAddressAddress)(rawDeliveredTo) : undefined,
        to: rawTo ? (0, _safeparseemailaddressesutil.safeParseEmailAddresses)(rawTo) : [],
        cc: rawCc ? (0, _safeparseemailaddressesutil.safeParseEmailAddresses)(rawCc) : [],
        bcc: rawBcc ? (0, _safeparseemailaddressesutil.safeParseEmailAddresses)(rawBcc) : [],
        body: decodedBody,
        isHtml,
        attachments,
        labelIds,
        messageHeaders
    };
};

//# sourceMappingURL=parse-gmail-message.util.js.map