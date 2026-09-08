"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGmailApiError", {
    enumerable: true,
    get: function() {
        return parseGmailApiError;
    }
});
const _messageimportdriverexception = require("../../exceptions/message-import-driver.exception");
const _parsegmailerrorretryafterutil = require("./parse-gmail-error-retry-after.util");
const parseGmailApiError = (error)=>{
    const gmailApiError = {
        code: error.response?.status,
        reason: error.response?.data?.error?.errors?.[0].reason || error.response?.data?.error || 'Unknown reason',
        message: error.response?.data?.error?.errors?.[0].message || error.response?.data?.error_description || 'Unknown error'
    };
    if (gmailApiError.code === 400) {
        if (gmailApiError.reason === 'invalid_grant') {
            return new _messageimportdriverexception.MessageImportDriverException(gmailApiError.message, _messageimportdriverexception.MessageImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        }
        if (gmailApiError.reason === 'failedPrecondition' && gmailApiError.message.includes('Mail service not enabled')) {
            return new _messageimportdriverexception.MessageImportDriverException(gmailApiError.message, _messageimportdriverexception.MessageImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        }
        if (gmailApiError.reason !== 'failedPrecondition') {
            return new _messageimportdriverexception.MessageImportDriverException(gmailApiError.message, _messageimportdriverexception.MessageImportDriverExceptionCode.UNKNOWN);
        }
    }
    if (gmailApiError.code === 404) {
        return new _messageimportdriverexception.MessageImportDriverException(gmailApiError.message, _messageimportdriverexception.MessageImportDriverExceptionCode.SYNC_CURSOR_ERROR);
    }
    if (gmailApiError.code === 429 || gmailApiError.code === 403) {
        return new _messageimportdriverexception.MessageImportDriverException(gmailApiError.message, _messageimportdriverexception.MessageImportDriverExceptionCode.TEMPORARY_ERROR, {
            throttleRetryAfter: (0, _parsegmailerrorretryafterutil.parseGmailErrorRetryAfter)(gmailApiError.message)
        });
    }
    return new _messageimportdriverexception.MessageImportDriverException(gmailApiError.message, _messageimportdriverexception.MessageImportDriverExceptionCode.TEMPORARY_ERROR);
};

//# sourceMappingURL=parse-gmail-api-error.util.js.map