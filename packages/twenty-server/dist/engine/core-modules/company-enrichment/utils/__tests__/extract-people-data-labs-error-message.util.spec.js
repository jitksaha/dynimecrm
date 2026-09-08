"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _extractpeopledatalabserrormessageutil = require("../extract-people-data-labs-error-message.util");
describe('extractPeopleDataLabsErrorMessage', ()=>{
    it('reads the nested People Data Labs error message', ()=>{
        expect((0, _extractpeopledatalabserrormessageutil.extractPeopleDataLabsErrorMessage)({
            json: {
                error: {
                    message: 'boom'
                }
            },
            httpStatus: 500
        })).toBe('boom');
    });
    it('reads a top level error string', ()=>{
        expect((0, _extractpeopledatalabserrormessageutil.extractPeopleDataLabsErrorMessage)({
            json: {
                error: 'rate limit'
            },
            httpStatus: 429
        })).toBe('rate limit');
    });
    it('reads a top level message string', ()=>{
        expect((0, _extractpeopledatalabserrormessageutil.extractPeopleDataLabsErrorMessage)({
            json: {
                message: 'not found'
            },
            httpStatus: 404
        })).toBe('not found');
    });
    it('joins an array of error messages', ()=>{
        expect((0, _extractpeopledatalabserrormessageutil.extractPeopleDataLabsErrorMessage)({
            json: {
                message: [
                    'first',
                    'second'
                ]
            },
            httpStatus: 400
        })).toBe('first; second');
    });
    it('falls back to a generic message when none is present', ()=>{
        expect((0, _extractpeopledatalabserrormessageutil.extractPeopleDataLabsErrorMessage)({
            json: {},
            httpStatus: 503
        })).toBe('PDL request failed (HTTP 503).');
    });
});

//# sourceMappingURL=extract-people-data-labs-error-message.util.spec.js.map