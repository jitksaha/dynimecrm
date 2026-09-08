"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewFilterUpdate", {
    enumerable: true,
    get: function() {
        return validateFlatViewFilterUpdate;
    }
});
const _core = require("@lingui/core");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _viewfilterexception = require("../../../../../metadata-modules/view-filter/exceptions/view-filter.exception");
const _isfieldmetadataoftypeutil = require("../../../../../utils/is-field-metadata-of-type.util");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const _getinvalidviewfilterselectoptionerrorutil = require("./get-invalid-view-filter-select-option-error.util");
const _getinvalidviewfiltervalueerrorutil = require("./get-invalid-view-filter-value-error.util");
const _getincompatibleviewfilteroperanderrorutil = require("./get-incompatible-view-filter-operand-error.util");
const validateFlatViewFilterUpdate = ({ universalIdentifier, flatEntityUpdate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatViewFilterMaps: optimisticFlatViewFilterMaps, flatFieldMetadataMaps, flatViewFilterGroupMaps } })=>{
    const existingViewFilter = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier,
        flatEntityMaps: optimisticFlatViewFilterMaps
    });
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier
        },
        metadataName: 'viewFilter',
        type: 'update'
    });
    if (!(0, _utils.isDefined)(existingViewFilter)) {
        validationResult.errors.push({
            code: _viewfilterexception.ViewFilterExceptionCode.VIEW_FILTER_NOT_FOUND,
            message: _core.i18n._(/*i18n*/ {
                id: "1KSqGE",
                message: "View filter not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "1KSqGE",
                message: "View filter not found"
            }
        });
        return validationResult;
    }
    const updatedFlatViewFilter = {
        ...existingViewFilter,
        ...flatEntityUpdate
    };
    const referencedFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: updatedFlatViewFilter.fieldMetadataUniversalIdentifier,
        flatEntityMaps: flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(referencedFieldMetadata)) {
        validationResult.errors.push({
            code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "MPt365",
                message: "Field metadata not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "MPt365",
                message: "Field metadata not found"
            }
        });
    } else {
        let relationTargetFieldType;
        if ((0, _utils.isDefined)(updatedFlatViewFilter.relationTargetFieldMetadataUniversalIdentifier)) {
            const relationTargetFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                universalIdentifier: updatedFlatViewFilter.relationTargetFieldMetadataUniversalIdentifier,
                flatEntityMaps: flatFieldMetadataMaps
            });
            relationTargetFieldType = relationTargetFieldMetadata?.type;
        }
        const incompatibleOperandError = (0, _getincompatibleviewfilteroperanderrorutil.getIncompatibleViewFilterOperandError)({
            operand: updatedFlatViewFilter.operand,
            fieldType: referencedFieldMetadata.type,
            subFieldName: updatedFlatViewFilter.subFieldName,
            relationTargetFieldType
        });
        if ((0, _utils.isDefined)(incompatibleOperandError)) {
            validationResult.errors.push(incompatibleOperandError);
        }
        if ('value' in flatEntityUpdate || 'fieldMetadataUniversalIdentifier' in flatEntityUpdate || 'operand' in flatEntityUpdate || 'subFieldName' in flatEntityUpdate || 'relationTargetFieldMetadataUniversalIdentifier' in flatEntityUpdate) {
            const invalidValueError = (0, _getinvalidviewfiltervalueerrorutil.getInvalidViewFilterValueError)({
                operand: updatedFlatViewFilter.operand,
                fieldType: referencedFieldMetadata.type,
                subFieldName: updatedFlatViewFilter.subFieldName,
                relationTargetFieldType,
                value: updatedFlatViewFilter.value
            });
            if ((0, _utils.isDefined)(invalidValueError)) {
                validationResult.errors.push(invalidValueError);
            }
        }
        if (('value' in flatEntityUpdate || 'fieldMetadataUniversalIdentifier' in flatEntityUpdate || 'operand' in flatEntityUpdate) && ((0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(referencedFieldMetadata, _types.FieldMetadataType.SELECT) || (0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(referencedFieldMetadata, _types.FieldMetadataType.MULTI_SELECT))) {
            const invalidSelectOptionError = (0, _getinvalidviewfilterselectoptionerrorutil.getInvalidViewFilterSelectOptionError)({
                referencedFieldMetadata,
                operand: updatedFlatViewFilter.operand,
                value: updatedFlatViewFilter.value
            });
            if ((0, _utils.isDefined)(invalidSelectOptionError)) {
                validationResult.errors.push(invalidSelectOptionError);
            }
        }
    }
    if ((0, _utils.isDefined)(updatedFlatViewFilter.viewFilterGroupUniversalIdentifier)) {
        const referencedViewFilterGroup = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedFlatViewFilter.viewFilterGroupUniversalIdentifier,
            flatEntityMaps: flatViewFilterGroupMaps
        });
        if (!(0, _utils.isDefined)(referencedViewFilterGroup)) {
            validationResult.errors.push({
                code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "eUPMYZ",
                    message: "View filter group not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "eUPMYZ",
                    message: "View filter group not found"
                }
            });
        }
    }
    return validationResult;
};

//# sourceMappingURL=validate-flat-view-filter-update.util.js.map