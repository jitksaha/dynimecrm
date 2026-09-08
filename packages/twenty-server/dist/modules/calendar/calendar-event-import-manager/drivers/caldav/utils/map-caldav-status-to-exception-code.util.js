"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapCalDavStatusToExceptionCode", {
    enumerable: true,
    get: function() {
        return mapCalDavStatusToExceptionCode;
    }
});
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
const mapCalDavStatusToExceptionCode = (status)=>{
    switch(status){
        case 401:
        case 403:
            return _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS;
        case 404:
        case 410:
            return _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND;
        case 408:
        case 429:
        case 500:
        case 502:
        case 503:
        case 504:
        case 507:
            return _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR;
        default:
            return _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN;
    }
};

//# sourceMappingURL=map-caldav-status-to-exception-code.util.js.map