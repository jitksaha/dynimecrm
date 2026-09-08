"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateChartFilter", {
    enumerable: true,
    get: function() {
        return validateChartFilter;
    }
});
const _core = require("@lingui/core");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _geteffectivefilterfieldtypeutil = require("../../../flat-field-metadata/utils/get-effective-filter-field-type.util");
const _pagelayoutwidgetexception = require("../../../page-layout-widget/exceptions/page-layout-widget.exception");
const validateChartRecordFilter = ({ recordFilter, widgetTitle, flatFieldMetadataMaps })=>{
    const { fieldMetadataUniversalIdentifier, relationTargetFieldMetadataUniversalIdentifier, operand: rawOperand, subFieldName, value } = recordFilter;
    if (!(0, _utils.isDefined)(fieldMetadataUniversalIdentifier)) {
        return [
            {
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "bhuNSV",
                    message: 'A chart filter of widget "{widgetTitle}" has no field metadata universal identifier',
                    values: {
                        widgetTitle: widgetTitle
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "PInBOB",
                    message: "A chart filter has no field"
                }
            }
        ];
    }
    const filterField = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        flatEntityMaps: flatFieldMetadataMaps,
        universalIdentifier: fieldMetadataUniversalIdentifier
    });
    // A missing field is already reported when the action is transpiled
    if (!(0, _utils.isDefined)(filterField)) {
        return [];
    }
    const relationTargetField = (0, _utils.isDefined)(relationTargetFieldMetadataUniversalIdentifier) ? (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        flatEntityMaps: flatFieldMetadataMaps,
        universalIdentifier: relationTargetFieldMetadataUniversalIdentifier
    }) : undefined;
    const effectiveFieldType = (0, _geteffectivefilterfieldtypeutil.getEffectiveFilterFieldType)({
        fieldType: filterField.type,
        relationTargetFieldType: relationTargetField?.type
    });
    const allowedOperands = (0, _utils.getFilterOperandsForFilterableFieldType)({
        filterType: (0, _utils.getFilterTypeFromFieldType)(effectiveFieldType),
        subFieldName
    });
    const operand = allowedOperands.find((allowedOperand)=>allowedOperand === rawOperand);
    if (!(0, _utils.isDefined)(operand)) {
        const allowedOperandsText = allowedOperands.join(', ');
        return [
            {
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "Rh2dh5",
                    message: 'Operand "{rawOperand}" of a chart filter of widget "{widgetTitle}" is not supported on field type "{effectiveFieldType}". Supported operands: {allowedOperandsText}.',
                    values: {
                        rawOperand: rawOperand,
                        widgetTitle: widgetTitle,
                        effectiveFieldType: effectiveFieldType,
                        allowedOperandsText: allowedOperandsText
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "z851aK",
                    message: "Chart filter operand is not supported for this field type"
                },
                value: rawOperand
            }
        ];
    }
    const issue = (0, _utils.getFilterValueValidationIssue)({
        fieldType: effectiveFieldType,
        operand,
        subFieldName,
        value
    });
    if (!(0, _utils.isDefined)(issue)) {
        return [];
    }
    const { stringifiedValue, filterType, hint } = issue;
    return [
        {
            code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA,
            message: (0, _guards.isNonEmptyString)(hint) ? _core.i18n._(/*i18n*/ {
                id: "JaflDh",
                message: 'Value "{stringifiedValue}" of a chart filter of widget "{widgetTitle}" is not valid for operand "{operand}" on field type "{filterType}". {hint}',
                values: {
                    stringifiedValue: stringifiedValue,
                    widgetTitle: widgetTitle,
                    operand: operand,
                    filterType: filterType,
                    hint: hint
                }
            }) : _core.i18n._(/*i18n*/ {
                id: "p3MMwa",
                message: 'Value "{stringifiedValue}" of a chart filter of widget "{widgetTitle}" is not valid for operand "{operand}" on field type "{filterType}".',
                values: {
                    stringifiedValue: stringifiedValue,
                    widgetTitle: widgetTitle,
                    operand: operand,
                    filterType: filterType
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "QHFBKw",
                message: "Chart filter value is not valid for this operand"
            },
            value
        }
    ];
};
const validateChartFilter = ({ filter, widgetTitle, flatFieldMetadataMaps })=>{
    const recordFilters = filter?.recordFilters;
    if (!(0, _utils.isDefined)(recordFilters)) {
        return [];
    }
    return recordFilters.flatMap((recordFilter)=>validateChartRecordFilter({
            recordFilter,
            widgetTitle,
            flatFieldMetadataMaps
        }));
};

//# sourceMappingURL=validate-chart-filter.util.js.map