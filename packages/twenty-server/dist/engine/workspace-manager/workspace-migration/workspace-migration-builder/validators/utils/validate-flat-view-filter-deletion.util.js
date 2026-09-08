"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewFilterDeletion", {
    enumerable: true,
    get: function() {
        return validateFlatViewFilterDeletion;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _viewfilterexception = require("../../../../../metadata-modules/view-filter/exceptions/view-filter.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const validateFlatViewFilterDeletion = ({ flatEntityToValidate: flatViewFilterToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatViewFilterMaps: optimisticFlatViewFilterMaps } })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier: flatViewFilterToValidate.universalIdentifier
        },
        metadataName: 'viewFilter',
        type: 'delete'
    });
    const existingViewFilter = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatViewFilterToValidate.universalIdentifier,
        flatEntityMaps: optimisticFlatViewFilterMaps
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
    return validationResult;
};

//# sourceMappingURL=validate-flat-view-filter-deletion.util.js.map