"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getInvalidViewFilterSelectOptionError", {
    enumerable: true,
    get: function() {
        return getInvalidViewFilterSelectOptionError;
    }
});
const _core = require("@lingui/core");
const _getinvalidselectfilteroptionvaluesutil = require("../../../../../metadata-modules/flat-field-metadata/utils/get-invalid-select-filter-option-values.util");
const _viewfilterexception = require("../../../../../metadata-modules/view-filter/exceptions/view-filter.exception");
const getInvalidViewFilterSelectOptionError = ({ referencedFieldMetadata, operand, value })=>{
    const invalidValues = (0, _getinvalidselectfilteroptionvaluesutil.getInvalidSelectFilterOptionValues)({
        fieldMetadata: referencedFieldMetadata,
        operand,
        value
    });
    if (invalidValues.length === 0) {
        return undefined;
    }
    const invalidValuesText = invalidValues.join(', ');
    const allowedValuesText = referencedFieldMetadata.options?.map((option)=>option.value).join(', ');
    return {
        code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
        message: _core.i18n._(/*i18n*/ {
            id: "PR/KbU",
            message: 'Filter on "{0}" uses option(s) {invalidValuesText} that do not exist. Allowed values: {allowedValuesText}.',
            values: {
                invalidValuesText: invalidValuesText,
                allowedValuesText: allowedValuesText,
                0: referencedFieldMetadata.label
            }
        }),
        userFriendlyMessage: /*i18n*/ {
            id: "dzteua",
            message: "Filter uses a select option that does not exist"
        }
    };
};

//# sourceMappingURL=get-invalid-view-filter-select-option-error.util.js.map