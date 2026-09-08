"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getInvalidViewFilterValueError", {
    enumerable: true,
    get: function() {
        return getInvalidViewFilterValueError;
    }
});
const _core = require("@lingui/core");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _geteffectivefilterfieldtypeutil = require("../../../../../metadata-modules/flat-field-metadata/utils/get-effective-filter-field-type.util");
const _viewfilterexception = require("../../../../../metadata-modules/view-filter/exceptions/view-filter.exception");
const getInvalidViewFilterValueError = ({ operand, fieldType, subFieldName, relationTargetFieldType, value })=>{
    const issue = (0, _utils.getFilterValueValidationIssue)({
        fieldType: (0, _geteffectivefilterfieldtypeutil.getEffectiveFilterFieldType)({
            fieldType,
            relationTargetFieldType
        }),
        operand,
        subFieldName,
        value
    });
    if (!(0, _utils.isDefined)(issue)) {
        return undefined;
    }
    const { stringifiedValue, filterType, hint } = issue;
    return {
        code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
        message: (0, _guards.isNonEmptyString)(hint) ? _core.i18n._(/*i18n*/ {
            id: "ccqQWi",
            message: 'Value "{stringifiedValue}" is not valid for operand "{operand}" on field type "{filterType}". {hint}',
            values: {
                stringifiedValue: stringifiedValue,
                operand: operand,
                filterType: filterType,
                hint: hint
            }
        }) : _core.i18n._(/*i18n*/ {
            id: "sFN4Dx",
            message: 'Value "{stringifiedValue}" is not valid for operand "{operand}" on field type "{filterType}".',
            values: {
                stringifiedValue: stringifiedValue,
                operand: operand,
                filterType: filterType
            }
        }),
        userFriendlyMessage: /*i18n*/ {
            id: "NCkLG1",
            message: "Filter value is not valid for this operand"
        }
    };
};

//# sourceMappingURL=get-invalid-view-filter-value-error.util.js.map