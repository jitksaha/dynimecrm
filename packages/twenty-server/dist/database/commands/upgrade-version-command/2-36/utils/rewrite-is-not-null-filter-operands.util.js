"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "rewriteIsNotNullFilterOperands", {
    enumerable: true,
    get: function() {
        return rewriteIsNotNullFilterOperands;
    }
});
const _utils = require("twenty-shared/utils");
const LEGACY_NOT_NULL_OPERAND_FRAGMENTS = [
    '"operand":"IS_NOT_NULL"',
    '"operand":"isNotNull"'
];
const IS_NOT_EMPTY_OPERAND_FRAGMENT = '"operand":"IS_NOT_EMPTY"';
const rewriteIsNotNullFilterOperands = (value)=>{
    if (!(0, _utils.isDefined)(value)) {
        return {
            value,
            changed: false
        };
    }
    const serialized = JSON.stringify(value);
    const rewritten = LEGACY_NOT_NULL_OPERAND_FRAGMENTS.reduce((accumulator, fragment)=>accumulator.split(fragment).join(IS_NOT_EMPTY_OPERAND_FRAGMENT), serialized);
    if (rewritten === serialized) {
        return {
            value,
            changed: false
        };
    }
    return {
        value: JSON.parse(rewritten),
        changed: true
    };
};

//# sourceMappingURL=rewrite-is-not-null-filter-operands.util.js.map