"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _resolvefiltervalueandoperandutil = require("../resolve-filter-value-and-operand.util");
const context = {
    trigger: {
        companyId: null,
        name: 'Acme',
        missing: undefined
    }
};
const resolve = (value, operand = _types.ViewFilterOperand.IS)=>(0, _resolvefiltervalueandoperandutil.resolveFilterValueAndOperand)({
        value,
        operand,
        context
    });
describe('resolveFilterValueAndOperand', ()=>{
    it('resolves a variable and keeps the operand when it has a value', ()=>{
        expect(resolve('{{trigger.name}}')).toEqual({
            value: 'Acme',
            operand: _types.ViewFilterOperand.IS
        });
    });
    it.each([
        [
            _types.ViewFilterOperand.IS,
            _types.ViewFilterOperand.IS_EMPTY
        ],
        [
            _types.ViewFilterOperand.IS_NOT,
            _types.ViewFilterOperand.IS_NOT_EMPTY
        ],
        [
            _types.ViewFilterOperand.CONTAINS,
            _types.ViewFilterOperand.IS_EMPTY
        ],
        [
            _types.ViewFilterOperand.DOES_NOT_CONTAIN,
            _types.ViewFilterOperand.IS_NOT_EMPTY
        ]
    ])('turns %s into %s when the variable resolves to null', (operand, emptinessOperand)=>{
        expect(resolve('{{trigger.companyId}}', operand)).toEqual({
            value: null,
            operand: emptinessOperand
        });
    });
    it('leaves a filter the user never filled alone', ()=>{
        expect(resolve('')).toEqual({
            value: '',
            operand: _types.ViewFilterOperand.IS
        });
    });
    it('leaves a literal value alone even when it reads as empty', ()=>{
        expect(resolve('[]')).toEqual({
            value: '[]',
            operand: _types.ViewFilterOperand.IS
        });
    });
    it('keeps the operand when a variable cannot be resolved at all', ()=>{
        expect(resolve('{{trigger.missing}}')).toEqual({
            value: undefined,
            operand: _types.ViewFilterOperand.IS
        });
    });
    it.each([
        [
            _types.ViewFilterOperand.GREATER_THAN_OR_EQUAL
        ],
        [
            _types.ViewFilterOperand.LESS_THAN_OR_EQUAL
        ],
        [
            _types.ViewFilterOperand.IS_BEFORE
        ],
        [
            _types.ViewFilterOperand.IS_AFTER
        ]
    ])('keeps %s, which has no emptiness reading', (operand)=>{
        expect(resolve('{{trigger.companyId}}', operand)).toEqual({
            value: null,
            operand
        });
    });
});

//# sourceMappingURL=resolve-filter-value-and-operand.util.spec.js.map