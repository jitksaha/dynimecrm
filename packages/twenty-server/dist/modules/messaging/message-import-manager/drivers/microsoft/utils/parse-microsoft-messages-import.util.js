"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMicrosoftMessagesImportError", {
    enumerable: true,
    get: function() {
        return parseMicrosoftMessagesImportError;
    }
});
const _microsoftpermanentaccounterrorcodesconstant = require("../../../../../connected-account/constants/microsoft-permanent-account-error-codes.constant");
const _messageimportdriverexception = require("../../exceptions/message-import-driver.exception");
const _utils = require("twenty-shared/utils");
const parseMicrosoftMessagesImportError = (error, options)=>{
    if ((0, _utils.isDefined)(error.code) && _microsoftpermanentaccounterrorcodesconstant.MICROSOFT_PERMANENT_ACCOUNT_ERROR_CODES.includes(error.code)) {
        return new _messageimportdriverexception.MessageImportDriverException(`Disabled, deleted, unlicensed or inaccessible Microsoft account - code:${error.code}`, _messageimportdriverexception.MessageImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS, {
            cause: options?.cause
        });
    }
    if (error.statusCode === 400 && (0, _utils.isDefined)(error.message)) {
        return new _messageimportdriverexception.MessageImportDriverException(`Invalid request to Microsoft Graph API: ${error.message}`, _messageimportdriverexception.MessageImportDriverExceptionCode.UNKNOWN, {
            cause: options?.cause
        });
    }
    if (error.statusCode === 404) {
        return new _messageimportdriverexception.MessageImportDriverException(`Not found - code:${error.code}`, _messageimportdriverexception.MessageImportDriverExceptionCode.NOT_FOUND, {
            cause: options?.cause
        });
    }
    if (error.statusCode === 410) {
        return new _messageimportdriverexception.MessageImportDriverException(`Sync cursor error: ${error.message}`, _messageimportdriverexception.MessageImportDriverExceptionCode.SYNC_CURSOR_ERROR, {
            cause: options?.cause
        });
    }
    return new _messageimportdriverexception.MessageImportDriverException(`Microsoft Graph API ${error.code} ${error.statusCode} error: ${error.message}`, _messageimportdriverexception.MessageImportDriverExceptionCode.TEMPORARY_ERROR, {
        cause: options?.cause
    });
};

//# sourceMappingURL=parse-microsoft-messages-import.util.js.map