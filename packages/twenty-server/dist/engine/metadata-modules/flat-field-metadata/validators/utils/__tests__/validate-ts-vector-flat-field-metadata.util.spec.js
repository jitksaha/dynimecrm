"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _validatetsvectorflatfieldmetadatautil = require("../validate-ts-vector-flat-field-metadata.util");
const createFlatEntityToValidate = (overrides = {})=>({
        type: _types.FieldMetadataType.TS_VECTOR,
        name: 'searchVector',
        isSystem: true,
        writability: _types.MetadataWritability.SYSTEM,
        ...overrides
    });
const callValidator = (flatEntityToValidate, update)=>(0, _validatetsvectorflatfieldmetadatautil.validateTsVectorFlatFieldMetadata)({
        flatEntityToValidate,
        update
    });
describe('validateTsVectorFlatFieldMetadata', ()=>{
    it('should return no errors for a SYSTEM writability search vector', ()=>{
        const errors = callValidator(createFlatEntityToValidate());
        expect(errors).toEqual([]);
    });
    it('should reject a create with non-SYSTEM writability', ()=>{
        const errors = callValidator(createFlatEntityToValidate({
            writability: _types.MetadataWritability.OPEN
        }));
        expect(errors).toHaveLength(1);
        expect(errors[0].message).toBe('Field type TS_VECTOR must have SYSTEM writability');
    });
    it('should reject an update that sets non-SYSTEM writability', ()=>{
        const errors = callValidator(createFlatEntityToValidate({
            writability: _types.MetadataWritability.OPEN
        }), {
            writability: _types.MetadataWritability.OPEN
        });
        expect(errors).toHaveLength(1);
        expect(errors[0].message).toBe('Field type TS_VECTOR must have SYSTEM writability');
    });
    it('should accept an update leaving writability untouched on a not-yet-migrated OPEN search vector', ()=>{
        const errors = callValidator(createFlatEntityToValidate({
            writability: _types.MetadataWritability.OPEN
        }), {
            isActive: false
        });
        expect(errors).toEqual([]);
    });
});

//# sourceMappingURL=validate-ts-vector-flat-field-metadata.util.spec.js.map