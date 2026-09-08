"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getInvalidSelectFilterOptionValues () {
        return getInvalidSelectFilterOptionValues;
    },
    get normalizeSelectFilterValues () {
        return normalizeSelectFilterValues;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const normalizeSelectFilterValues = (value)=>{
    // TODO: Remove legacy scalar/stringified-value support after all view filter
    // values have been migrated to their canonical JSON representation.
    if ((0, _guards.isArray)(value)) {
        return value.filter(_guards.isNonEmptyString);
    }
    if (!(0, _guards.isNonEmptyString)(value)) {
        return [];
    }
    try {
        const parsedValue = JSON.parse(value);
        if ((0, _guards.isArray)(parsedValue)) {
            return parsedValue.filter(_guards.isNonEmptyString);
        }
    } catch  {
    // Not a JSON-stringified array — treat the raw string as a single value.
    }
    return [
        value
    ];
};
const getInvalidSelectFilterOptionValues = ({ fieldMetadata, operand, subFieldName, value })=>{
    if (!(0, _utils.isRecordFilterOperandExpectingValue)(operand)) {
        return [];
    }
    if ((0, _guards.isNonEmptyString)(subFieldName)) {
        return [];
    }
    const filterValues = normalizeSelectFilterValues(value);
    if (filterValues.length === 0) {
        return [];
    }
    if (!(0, _utils.isDefined)(fieldMetadata.options)) {
        return filterValues;
    }
    return filterValues.filter((filterValue)=>fieldMetadata.options.every((option)=>option.value !== filterValue));
};

//# sourceMappingURL=get-invalid-select-filter-option-values.util.js.map