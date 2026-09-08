"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _removeundefinedfromrecordutil = require("../remove-undefined-from-record.util");
describe('removeUndefinedFromRecord', ()=>{
    it('should strip undefined values', ()=>{
        expect((0, _removeundefinedfromrecordutil.removeUndefinedFromRecord)({
            name: 'John',
            age: undefined
        })).toEqual({
            name: 'John'
        });
    });
    it('should preserve null values so a field can be cleared', ()=>{
        expect((0, _removeundefinedfromrecordutil.removeUndefinedFromRecord)({
            name: 'John',
            closeDate: null
        })).toEqual({
            name: 'John',
            closeDate: null
        });
    });
    it('should preserve null sub-properties in composite fields', ()=>{
        expect((0, _removeundefinedfromrecordutil.removeUndefinedFromRecord)({
            emails: {
                primaryEmail: null,
                additionalEmails: undefined
            }
        })).toEqual({
            emails: {
                primaryEmail: null
            }
        });
    });
    it('should drop nested objects that only contain undefined', ()=>{
        expect((0, _removeundefinedfromrecordutil.removeUndefinedFromRecord)({
            emails: {
                primaryEmail: undefined
            },
            name: 'John'
        })).toEqual({
            name: 'John'
        });
    });
    it('should preserve arrays as-is', ()=>{
        expect((0, _removeundefinedfromrecordutil.removeUndefinedFromRecord)({
            tags: [
                'a',
                'b'
            ],
            removed: undefined
        })).toEqual({
            tags: [
                'a',
                'b'
            ]
        });
    });
});

//# sourceMappingURL=remove-undefined-from-record.util.spec.js.map