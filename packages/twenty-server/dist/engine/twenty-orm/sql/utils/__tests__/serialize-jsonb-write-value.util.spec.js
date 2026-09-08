"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _serializejsonbwritevalueutil = require("../serialize-jsonb-write-value.util");
const columnShape = (fieldMetadataType)=>({
        columnName: 'someColumn',
        fieldMetadataId: 'field-id',
        fieldName: 'someField',
        fieldMetadataType
    });
describe('serializeJsonbWriteValue', ()=>{
    it('stringifies an array value for a RAW_JSON column', ()=>{
        const value = [
            {
                url: 'https://twenty.com',
                label: 'Twenty'
            }
        ];
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(columnShape(_types.FieldMetadataType.RAW_JSON), value)).toBe('[{"url":"https://twenty.com","label":"Twenty"}]');
    });
    it('stringifies an array value for a FILES column', ()=>{
        const value = [
            {
                fileId: 'file-1',
                label: 'doc.pdf'
            }
        ];
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(columnShape(_types.FieldMetadataType.FILES), value)).toBe('[{"fileId":"file-1","label":"doc.pdf"}]');
    });
    it('stringifies an object value for a jsonb column', ()=>{
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(columnShape(_types.FieldMetadataType.RAW_JSON), {
            a: 1
        })).toBe('{"a":1}');
    });
    it('passes null through for a jsonb column so it binds SQL NULL', ()=>{
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(columnShape(_types.FieldMetadataType.RAW_JSON), null)).toBeNull();
    });
    it('leaves a non-jsonb text value untouched', ()=>{
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(columnShape(_types.FieldMetadataType.TEXT), 'hello')).toBe('hello');
    });
    it('leaves a MULTI_SELECT array untouched so pg renders a Postgres array literal', ()=>{
        const value = [
            'A',
            'B'
        ];
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(columnShape(_types.FieldMetadataType.MULTI_SELECT), value)).toBe(value);
    });
    it('returns the value unchanged when the column shape is unknown', ()=>{
        const value = [
            1,
            2,
            3
        ];
        expect((0, _serializejsonbwritevalueutil.serializeJsonbWriteValue)(undefined, value)).toBe(value);
    });
});

//# sourceMappingURL=serialize-jsonb-write-value.util.spec.js.map