"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMicrosoftCalendarError", {
    enumerable: true,
    get: function() {
        return parseMicrosoftCalendarError;
    }
});
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
const _microsoftpermanentaccounterrorcodesconstant = require("../../../../../connected-account/constants/microsoft-permanent-account-error-codes.constant");
const _utils = require("twenty-shared/utils");
const parseMicrosoftCalendarError = (error)=>{
    const { statusCode, code, message } = error;
    if ((0, _utils.isDefined)(code) && _microsoftpermanentaccounterrorcodesconstant.MICROSOFT_PERMANENT_ACCOUNT_ERROR_CODES.includes(code)) {
        return new _calendareventimportdriverexception.CalendarEventImportDriverException(`Disabled, deleted, unlicensed or inaccessible Microsoft account - code:${code}`, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    }
    if (statusCode === 400 && (0, _utils.isDefined)(message)) {
        return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
    }
    if (statusCode === 404) {
        return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND);
    }
    if (statusCode === 410) {
        return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.SYNC_CURSOR_ERROR);
    }
    return new _calendareventimportdriverexception.CalendarEventImportDriverException(`Microsoft Graph API ${code} ${statusCode} error: ${message}`, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
};

//# sourceMappingURL=parse-microsoft-calendar-error.util.js.map