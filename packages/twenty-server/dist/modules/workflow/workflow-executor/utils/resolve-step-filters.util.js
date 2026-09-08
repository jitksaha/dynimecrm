"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveStepFilters", {
    enumerable: true,
    get: function() {
        return resolveStepFilters;
    }
});
const _utils = require("twenty-shared/utils");
const _resolvefiltervalueandoperandutil = require("./resolve-filter-value-and-operand.util");
const resolveStepFilters = ({ stepFilters, context })=>stepFilters.map((stepFilter)=>{
        const { value: rightOperand, operand } = (0, _resolvefiltervalueandoperandutil.resolveFilterValueAndOperand)({
            value: stepFilter.value,
            operand: stepFilter.operand,
            context
        });
        return {
            ...stepFilter,
            operand,
            rightOperand,
            leftOperand: (0, _utils.resolveInput)(stepFilter.stepOutputKey, context)
        };
    });

//# sourceMappingURL=resolve-step-filters.util.js.map