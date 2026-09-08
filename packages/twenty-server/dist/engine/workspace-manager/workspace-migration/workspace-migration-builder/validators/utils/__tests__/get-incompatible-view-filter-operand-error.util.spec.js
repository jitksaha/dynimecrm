"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _viewfilterexception = require("../../../../../../metadata-modules/view-filter/exceptions/view-filter.exception");
const _getincompatibleviewfilteroperanderrorutil = require("../get-incompatible-view-filter-operand-error.util");
describe('getIncompatibleViewFilterOperandError', ()=>{
    it('should return undefined when the operand is supported by the field type', ()=>{
        expect((0, _getincompatibleviewfilteroperanderrorutil.getIncompatibleViewFilterOperandError)({
            operand: _types.ViewFilterOperand.CONTAINS,
            fieldType: _types.FieldMetadataType.TEXT,
            subFieldName: null,
            relationTargetFieldType: undefined
        })).toBeUndefined();
    });
    it('should return an error when the operand is not supported by the field type', ()=>{
        const error = (0, _getincompatibleviewfilteroperanderrorutil.getIncompatibleViewFilterOperandError)({
            operand: _types.ViewFilterOperand.IS_IN_PAST,
            fieldType: _types.FieldMetadataType.TEXT,
            subFieldName: null,
            relationTargetFieldType: undefined
        });
        expect(error?.code).toBe(_viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA);
        expect(error?.message).toContain(_types.ViewFilterOperand.IS_IN_PAST);
    });
    it('should list the supported operands in the error message', ()=>{
        const error = (0, _getincompatibleviewfilteroperanderrorutil.getIncompatibleViewFilterOperandError)({
            operand: _types.ViewFilterOperand.IS_IN_PAST,
            fieldType: _types.FieldMetadataType.TEXT,
            subFieldName: null,
            relationTargetFieldType: undefined
        });
        expect(error?.message).toContain(_types.ViewFilterOperand.CONTAINS);
    });
    it('should resolve the effective field type through the relation target', ()=>{
        const error = (0, _getincompatibleviewfilteroperanderrorutil.getIncompatibleViewFilterOperandError)({
            operand: _types.ViewFilterOperand.IS_IN_PAST,
            fieldType: _types.FieldMetadataType.RELATION,
            subFieldName: null,
            relationTargetFieldType: _types.FieldMetadataType.DATE_TIME
        });
        expect(error).toBeUndefined();
    });
});

//# sourceMappingURL=get-incompatible-view-filter-operand-error.util.spec.js.map