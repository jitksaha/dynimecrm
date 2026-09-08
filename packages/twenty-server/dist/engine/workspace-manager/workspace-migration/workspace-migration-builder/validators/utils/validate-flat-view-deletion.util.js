"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatViewDeletion", {
    enumerable: true,
    get: function() {
        return validateFlatViewDeletion;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _viewexception = require("../../../../../metadata-modules/view/exceptions/view.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const validateFlatViewDeletion = ({ flatEntityToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatViewMaps: optimisticFlatViewMaps, flatObjectMetadataMaps: optimisticFlatObjectMetadataMaps } })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier: flatEntityToValidate.universalIdentifier
        },
        metadataName: 'view',
        type: 'delete'
    });
    const existingFlatView = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatEntityToValidate.universalIdentifier,
        flatEntityMaps: optimisticFlatViewMaps
    });
    if (!(0, _utils.isDefined)(existingFlatView)) {
        validationResult.errors.push({
            code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
            message: _core.i18n._(/*i18n*/ {
                id: "F4A9mL",
                message: "View not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "F4A9mL",
                message: "View not found"
            }
        });
        return validationResult;
    }
    const parentObjectStillExists = (0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: existingFlatView.objectMetadataUniversalIdentifier,
        flatEntityMaps: optimisticFlatObjectMetadataMaps
    }));
    if (parentObjectStillExists) {
        const viewsForSameObject = Object.values(optimisticFlatViewMaps.byUniversalIdentifier).filter((view)=>(0, _utils.isDefined)(view) && view.objectMetadataUniversalIdentifier === existingFlatView.objectMetadataUniversalIdentifier);
        if (viewsForSameObject.length <= 1) {
            validationResult.errors.push({
                code: _viewexception.ViewExceptionCode.INVALID_VIEW_DATA,
                message: _core.i18n._(/*i18n*/ {
                    id: "W3Ik7m",
                    message: "Cannot delete the only view for this object"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "W3Ik7m",
                    message: "Cannot delete the only view for this object"
                }
            });
        }
    }
    return validationResult;
};

//# sourceMappingURL=validate-flat-view-deletion.util.js.map