"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getIncompatibleViewFilterOperandError", {
    enumerable: true,
    get: function() {
        return getIncompatibleViewFilterOperandError;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _geteffectivefilterfieldtypeutil = require("../../../../../metadata-modules/flat-field-metadata/utils/get-effective-filter-field-type.util");
const _viewfilterexception = require("../../../../../metadata-modules/view-filter/exceptions/view-filter.exception");
const getIncompatibleViewFilterOperandError = ({ operand, fieldType, subFieldName, relationTargetFieldType })=>{
    const effectiveFieldType = (0, _geteffectivefilterfieldtypeutil.getEffectiveFilterFieldType)({
        fieldType,
        relationTargetFieldType
    });
    const filterType = (0, _utils.getFilterTypeFromFieldType)(effectiveFieldType);
    const allowedOperands = (0, _utils.getFilterOperandsForFilterableFieldType)({
        filterType,
        subFieldName
    });
    if (allowedOperands.includes(operand)) {
        return undefined;
    }
    return {
        code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
        message: _core.i18n._(/*i18n*/ {
            id: "e/+ykp",
            message: 'Operand "{operand}" is not supported on field type "{filterType}". Supported operands: {0}.',
            values: {
                operand: operand,
                filterType: filterType,
                0: allowedOperands.join(', ')
            }
        }),
        userFriendlyMessage: /*i18n*/ {
            id: "MkIaen",
            message: "Filter operand is not supported for this field type"
        }
    };
};

//# sourceMappingURL=get-incompatible-view-filter-operand-error.util.js.map