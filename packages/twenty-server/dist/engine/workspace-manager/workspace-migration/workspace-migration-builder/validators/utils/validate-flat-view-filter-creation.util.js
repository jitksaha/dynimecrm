"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewFilterCreation", {
    enumerable: true,
    get: function() {
        return validateFlatViewFilterCreation;
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
const validateFlatViewFilterCreation = ({ flatEntityToValidate: flatViewFilterToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatViewFilterMaps: optimisticFlatViewFilterMaps, flatViewMaps, flatFieldMetadataMaps, flatViewFilterGroupMaps } })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier: flatViewFilterToValidate.universalIdentifier
        },
        metadataName: 'viewFilter',
        type: 'create'
    });
    const existingViewFilter = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewFilterToValidate.universalIdentifier,
        flatEntityMaps: optimisticFlatViewFilterMaps
    });
    if ((0, _utils.isDefined)(existingViewFilter)) {
        validationResult.errors.push({
            code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "bM1MKh",
                message: "View filter with this universal identifier already exists"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "sbHaOg",
                message: "View filter already exists"
            }
        });
    }
    const referencedView = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewFilterToValidate.viewUniversalIdentifier,
        flatEntityMaps: flatViewMaps
    });
    if (!(0, _utils.isDefined)(referencedView)) {
        validationResult.errors.push({
            code: _viewfilterexception.ViewFilterExceptionCode.INVALID_VIEW_FILTER_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "F4A9mL",
                message: "View not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "F4A9mL",
                message: "View not found"
            }
        });
    }
    const referencedFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewFilterToValidate.fieldMetadataUniversalIdentifier,
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
        if ((0, _utils.isDefined)(flatViewFilterToValidate.relationTargetFieldMetadataUniversalIdentifier)) {
            const relationTargetFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                universalIdentifier: flatViewFilterToValidate.relationTargetFieldMetadataUniversalIdentifier,
                flatEntityMaps: flatFieldMetadataMaps
            });
            relationTargetFieldType = relationTargetFieldMetadata?.type;
        }
        const incompatibleOperandError = (0, _getincompatibleviewfilteroperanderrorutil.getIncompatibleViewFilterOperandError)({
            operand: flatViewFilterToValidate.operand,
            fieldType: referencedFieldMetadata.type,
            subFieldName: flatViewFilterToValidate.subFieldName,
            relationTargetFieldType
        });
        if ((0, _utils.isDefined)(incompatibleOperandError)) {
            validationResult.errors.push(incompatibleOperandError);
        }
        const invalidValueError = (0, _getinvalidviewfiltervalueerrorutil.getInvalidViewFilterValueError)({
            operand: flatViewFilterToValidate.operand,
            fieldType: referencedFieldMetadata.type,
            subFieldName: flatViewFilterToValidate.subFieldName,
            relationTargetFieldType,
            value: flatViewFilterToValidate.value
        });
        if ((0, _utils.isDefined)(invalidValueError)) {
            validationResult.errors.push(invalidValueError);
        }
        if ((0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(referencedFieldMetadata, _types.FieldMetadataType.SELECT) || (0, _isfieldmetadataoftypeutil.isFieldMetadataEntityOfType)(referencedFieldMetadata, _types.FieldMetadataType.MULTI_SELECT)) {
            const invalidSelectOptionError = (0, _getinvalidviewfilterselectoptionerrorutil.getInvalidViewFilterSelectOptionError)({
                referencedFieldMetadata,
                operand: flatViewFilterToValidate.operand,
                value: flatViewFilterToValidate.value
            });
            if ((0, _utils.isDefined)(invalidSelectOptionError)) {
                validationResult.errors.push(invalidSelectOptionError);
            }
        }
    }
    if ((0, _utils.isDefined)(flatViewFilterToValidate.viewFilterGroupUniversalIdentifier)) {
        const referencedViewFilterGroup = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatViewFilterToValidate.viewFilterGroupUniversalIdentifier,
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

//# sourceMappingURL=validate-flat-view-filter-creation.util.js.map