"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveFilterValueAndOperand", {
    enumerable: true,
    get: function() {
        return resolveFilterValueAndOperand;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const EMPTINESS_OPERAND_BY_OPERAND = {
    [_types.ViewFilterOperand.IS]: _types.ViewFilterOperand.IS_EMPTY,
    [_types.ViewFilterOperand.IS_NOT]: _types.ViewFilterOperand.IS_NOT_EMPTY,
    [_types.ViewFilterOperand.CONTAINS]: _types.ViewFilterOperand.IS_EMPTY,
    [_types.ViewFilterOperand.DOES_NOT_CONTAIN]: _types.ViewFilterOperand.IS_NOT_EMPTY
};
const resolveFilterValueAndOperand = ({ value, operand, context })=>{
    const resolvedValue = (0, _utils.resolveInput)(value, context);
    if (!(0, _utils.isVariableReference)(value) || resolvedValue !== null) {
        return {
            value: resolvedValue,
            operand
        };
    }
    return {
        value: resolvedValue,
        operand: EMPTINESS_OPERAND_BY_OPERAND[operand] ?? operand
    };
};

//# sourceMappingURL=resolve-filter-value-and-operand.util.js.map