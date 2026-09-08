"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGoogleCalendarError", {
    enumerable: true,
    get: function() {
        return parseGoogleCalendarError;
    }
});
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
const parseGoogleCalendarError = (error)=>{
    const { code, reason, message } = error;
    if (code === 400) {
        if (reason === 'invalid_grant') {
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        }
        if (reason !== 'failedPrecondition') {
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
        }
    }
    if (code === 403 && (reason === 'notACalendarUser' || message.includes('The user must be signed up for Google Calendar'))) {
        return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    }
    if (code === 404) {
        return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND);
    }
    return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
};

//# sourceMappingURL=parse-google-calendar-error.util.js.map