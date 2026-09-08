"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveRecordFilters", {
    enumerable: true,
    get: function() {
        return resolveRecordFilters;
    }
});
const _resolvefiltervalueandoperandutil = require("../../../utils/resolve-filter-value-and-operand.util");
const resolveRecordFilters = ({ unresolvedRecordFilters, context })=>unresolvedRecordFilters?.map((recordFilter)=>{
        const { value, operand } = (0, _resolvefiltervalueandoperandutil.resolveFilterValueAndOperand)({
            value: recordFilter.value,
            operand: recordFilter.operand,
            context
        });
        return {
            ...recordFilter,
            value: value,
            operand
        };
    });

//# sourceMappingURL=resolve-record-filters.util.js.map