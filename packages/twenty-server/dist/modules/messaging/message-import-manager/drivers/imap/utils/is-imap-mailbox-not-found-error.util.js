"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isImapMailboxNotFoundError", {
    enumerable: true,
    get: function() {
        return isImapMailboxNotFoundError;
    }
});
const _isimapflowerrorutil = require("./is-imap-flow-error.util");
const _missingmailboxmessageprefixesconst = require("./missing-mailbox-message-prefixes.const");
const isImapMailboxNotFoundError = (error)=>{
    if (!(0, _isimapflowerrorutil.isImapFlowError)(error) || error.responseStatus !== 'NO') {
        return false;
    }
    if (error.serverResponseCode?.toUpperCase() === 'NONEXISTENT' || error.mailboxMissing) {
        return true;
    }
    const responseText = error.responseText?.toLowerCase();
    return _missingmailboxmessageprefixesconst.MISSING_MAILBOX_MESSAGE_PREFIXES.some((prefix)=>responseText?.startsWith(prefix));
};

//# sourceMappingURL=is-imap-mailbox-not-found-error.util.js.map