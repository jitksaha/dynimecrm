"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _generaterandomfieldvalueutil = require("../generate-random-field-value.util");
const buildField = (name, type)=>({
        name,
        type,
        options: null
    });
describe('generateRandomFieldValue', ()=>{
    // The document is diffed against main's in CI, so two generations of the same
    // field have to agree or every operation reads as changed.
    it.each([
        _types.FieldMetadataType.UUID,
        _types.FieldMetadataType.TEXT,
        _types.FieldMetadataType.EMAILS,
        _types.FieldMetadataType.LINKS,
        _types.FieldMetadataType.CURRENCY,
        _types.FieldMetadataType.FULL_NAME,
        _types.FieldMetadataType.ADDRESS,
        _types.FieldMetadataType.ACTOR,
        _types.FieldMetadataType.NUMBER,
        _types.FieldMetadataType.NUMERIC,
        _types.FieldMetadataType.DATE_TIME
    ])('returns a stable value for %s', (type)=>{
        const field = buildField('someField', type);
        expect((0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field
        })).toEqual((0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field
        }));
    });
    it('does not depend on the order fields are generated in', ()=>{
        const first = buildField('firstField', _types.FieldMetadataType.EMAILS);
        const second = buildField('secondField', _types.FieldMetadataType.EMAILS);
        const inOrder = (0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field: second
        });
        (0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field: first
        });
        expect((0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field: second
        })).toEqual(inOrder);
    });
    it('gives different fields different values', ()=>{
        expect((0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field: buildField('alpha', _types.FieldMetadataType.FULL_NAME)
        })).not.toEqual((0, _generaterandomfieldvalueutil.generateRandomFieldValue)({
            field: buildField('beta', _types.FieldMetadataType.FULL_NAME)
        }));
    });
});

//# sourceMappingURL=generate-random-field-value.util.spec.js.map