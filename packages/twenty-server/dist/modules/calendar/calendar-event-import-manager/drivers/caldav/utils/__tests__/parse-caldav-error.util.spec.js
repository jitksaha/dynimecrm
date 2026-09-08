"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _parsecaldaverrorutil = require("../parse-caldav-error.util");
const _calendareventimportdriverexception = require("../../../exceptions/calendar-event-import-driver.exception");
const expectCode = (message, code)=>{
    expect((0, _parsecaldaverrorutil.parseCalDAVError)(new Error(message)).code).toBe(code);
};
describe('parseCalDAVError', ()=>{
    it.each([
        'no account for smartCollectionSync',
        'no account for fetchAddressBooks',
        'no account for fetchCalendars',
        'Must have account before syncCalendars',
        'Invalid auth method',
        'Invalid credentials',
        'cannot find principalUrl'
    ])('maps "%s" to INSUFFICIENT_PERMISSIONS', (message)=>{
        expectCode(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
    });
    it.each([
        'Collection does not exist on server',
        'cannot fetchVCards for undefined addressBook',
        'cannot find calendarUserAddresses',
        'cannot fetchCalendarObjects for undefined calendar',
        'cannot find homeUrl'
    ])('maps "%s" to NOT_FOUND', (message)=>{
        expectCode(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND);
    });
    describe('messages tsdav interpolates', ()=>{
        it('maps the credentials failure raised during login to INSUFFICIENT_PERMISSIONS', ()=>{
            expectCode('Invalid credentials: PROPFIND https://dav.example.com/ returned 401 Unauthorized', _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        });
    });
    it('falls back to UNKNOWN for unrecognised errors', ()=>{
        expectCode('TLS handshake failed', _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
    });
    it('forwards the original error message untouched', ()=>{
        expect((0, _parsecaldaverrorutil.parseCalDAVError)(new Error('Invalid auth method')).message).toBe('Invalid auth method');
    });
});

//# sourceMappingURL=parse-caldav-error.util.spec.js.map