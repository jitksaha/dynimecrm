"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _getoperatorsforfieldtypeutil = require("../get-operators-for-field-type.util");
describe('getOperatorsForFieldType', ()=>{
    it('should return STRING_FILTER_OPERATORS for TEXT', ()=>{
        const result = (0, _getoperatorsforfieldtypeutil.getOperatorsForFieldType)(_types.FieldMetadataType.TEXT);
        expect(result).toContain('eq');
        expect(result).toContain('like');
        expect(result).toContain('startsWith');
    });
    it('should return NUMBER_FILTER_OPERATORS for NUMBER', ()=>{
        const result = (0, _getoperatorsforfieldtypeutil.getOperatorsForFieldType)(_types.FieldMetadataType.NUMBER);
        expect(result).toContain('eq');
        expect(result).toContain('gt');
        expect(result).toContain('in');
    });
    it('should return BOOLEAN_FILTER_OPERATORS for BOOLEAN', ()=>{
        const result = (0, _getoperatorsforfieldtypeutil.getOperatorsForFieldType)(_types.FieldMetadataType.BOOLEAN);
        expect(result).toEqual([
            'eq',
            'is'
        ]);
    });
    it('should return ARRAY_FILTER_OPERATORS for ARRAY', ()=>{
        const result = (0, _getoperatorsforfieldtypeutil.getOperatorsForFieldType)(_types.FieldMetadataType.ARRAY);
        expect(result).toContain('containsIlike');
        expect(result).toContain('isEmptyArray');
    });
    it.each([
        _types.FieldMetadataType.SELECT,
        _types.FieldMetadataType.RATING
    ])('should allow enum operators and ordering operators for %s', (fieldType)=>{
        const result = (0, _getoperatorsforfieldtypeutil.getOperatorsForFieldType)(fieldType);
        expect(result).toContain('eq');
        expect(result).toContain('in');
        expect(result).toContain('gt');
        expect(result).toContain('gte');
        expect(result).toContain('lt');
        expect(result).toContain('lte');
    });
});

//# sourceMappingURL=get-operators-for-field-type.util.spec.js.map