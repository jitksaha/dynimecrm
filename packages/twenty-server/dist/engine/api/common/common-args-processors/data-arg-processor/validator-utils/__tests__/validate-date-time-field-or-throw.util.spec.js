"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _validatedatetimefieldorthrowutil = require("../validate-date-time-field-or-throw.util");
const _commonqueryrunnerexception = require("../../../../common-query-runners/errors/common-query-runner.exception");
describe('validateDateTimeFieldOrThrow', ()=>{
    describe('valid inputs (normalized to a canonical instant)', ()=>{
        it('should return null when value is null', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)(null, 'testField');
            expect(result).toBeNull();
        });
        it('should keep the instant for an ISO datetime string with Z timezone', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:30:00Z', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should drop a zero millisecond fraction', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:30:00.000Z', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should convert a timezone offset to its UTC instant', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:30:00+02:00', 'testField');
            expect(result).toBe('2024-01-15T08:30:00Z');
        });
        it('should convert a timezone offset with milliseconds to its UTC instant', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:30:00.000+02:00', 'testField');
            expect(result).toBe('2024-01-15T08:30:00Z');
        });
        it('should interpret a zoneless ISO datetime as UTC', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:30:00', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should interpret a zoneless ISO datetime with milliseconds as UTC', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:30:00.000', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should normalize a datetime with a space separator', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15 10:30:00', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should normalize a datetime with a space separator and milliseconds', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15 10:30:00.000', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should normalize a datetime with a space separator without seconds', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15 10:30', 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
        it('should normalize a date-only value to midnight UTC', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15', 'testField');
            expect(result).toBe('2024-01-15T00:00:00Z');
        });
        it('should normalize a compact date-only value to midnight UTC', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('20240115', 'testField');
            expect(result).toBe('2024-01-15T00:00:00Z');
        });
        it('should normalize a date with a full month name to midnight UTC', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('January 15, 2024', 'testField');
            expect(result).toBe('2024-01-15T00:00:00Z');
        });
        it('should normalize a Date object to its instant', ()=>{
            const result = (0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)(new Date('2024-01-15T10:30:00Z'), 'testField');
            expect(result).toBe('2024-01-15T10:30:00Z');
        });
    });
    describe('invalid inputs', ()=>{
        it('should throw when value is just a year', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is year and month only', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is an invalid datetime string', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('invalid-datetime', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is an empty string', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a boolean', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)(true, 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is an array', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)([], 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is an object', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)({}, 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is undefined', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)(undefined, 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a number (timestamp)', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)(1234567890, 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a random string', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('hello world', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a datetime with invalid month', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-13-01T10:30:00Z', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a datetime with invalid day', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-02-31T10:30:00Z', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a datetime with invalid hour', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T25:30:00Z', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
        it('should throw when value is a datetime with invalid minute', ()=>{
            expect(()=>(0, _validatedatetimefieldorthrowutil.validateDateTimeFieldOrThrow)('2024-01-15T10:60:00Z', 'testField')).toThrow(_commonqueryrunnerexception.CommonQueryRunnerException);
        });
    });
});

//# sourceMappingURL=validate-date-time-field-or-throw.util.spec.js.map