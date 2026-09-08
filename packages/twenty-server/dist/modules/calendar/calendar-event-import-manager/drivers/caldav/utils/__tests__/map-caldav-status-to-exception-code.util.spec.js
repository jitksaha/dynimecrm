"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mapcaldavstatustoexceptioncodeutil = require("../map-caldav-status-to-exception-code.util");
const _calendareventimportdriverexception = require("../../../exceptions/calendar-event-import-driver.exception");
describe('mapCalDavStatusToExceptionCode', ()=>{
    it('maps auth failures to INSUFFICIENT_PERMISSIONS', ()=>{
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(401)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(403)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it('maps missing collections to NOT_FOUND', ()=>{
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(404)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(410)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND);
    });
    it('maps throttling and server failures to TEMPORARY_ERROR', ()=>{
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(408)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(429)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(500)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(502)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(503)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(504)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(507)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
    });
    it('falls back to UNKNOWN for unrecognised statuses', ()=>{
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(400)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(418)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
    });
    it('falls back to UNKNOWN when the server sent no status', ()=>{
        expect((0, _mapcaldavstatustoexceptioncodeutil.mapCalDavStatusToExceptionCode)(undefined)).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
    });
});

//# sourceMappingURL=map-caldav-status-to-exception-code.util.spec.js.map