"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _calendareventimportdriverexception = require("../../../exceptions/calendar-event-import-driver.exception");
const _parsegaxioserrorutil = require("../parse-gaxios-error.util");
const gaxiosErrorWithCode = (code)=>({
        code,
        message: `socket failure: ${code}`
    });
describe('parseGaxiosError', ()=>{
    it.each([
        'ECONNRESET',
        'ENOTFOUND',
        'ECONNABORTED',
        'ETIMEDOUT',
        'ERR_NETWORK'
    ])('maps the %s socket failure to a temporary error', (code)=>{
        const exception = (0, _parsegaxioserrorutil.parseGaxiosError)(gaxiosErrorWithCode(code));
        expect(exception.code).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        expect(exception.message).toBe(`socket failure: ${code}`);
    });
    it.each([
        'EHOSTUNREACH',
        'ECONNREFUSED',
        'EPIPE'
    ])('maps the unmatched %s socket failure to an unknown network error', (code)=>{
        const exception = (0, _parsegaxioserrorutil.parseGaxiosError)(gaxiosErrorWithCode(code));
        expect(exception.code).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN_NETWORK_ERROR);
    });
    it('maps an error without a code to an unknown network error', ()=>{
        const exception = (0, _parsegaxioserrorutil.parseGaxiosError)({
            message: 'no code at all'
        });
        expect(exception.code).toBe(_calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN_NETWORK_ERROR);
    });
});

//# sourceMappingURL=parse-gaxios-error.util.spec.js.map