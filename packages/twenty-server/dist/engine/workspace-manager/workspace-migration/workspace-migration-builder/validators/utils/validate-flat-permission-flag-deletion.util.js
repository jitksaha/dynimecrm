"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatPermissionFlagDeletion", {
    enumerable: true,
    get: function() {
        return validateFlatPermissionFlagDeletion;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _permissionflagexception = require("../../../../../metadata-modules/permission-flag/permission-flag.exception");
const _belongstotwentystandardapputil = require("../../../../../metadata-modules/utils/belongs-to-twenty-standard-app.util");
const _iscallertwentystandardapputil = require("../../../../../metadata-modules/utils/is-caller-twenty-standard-app.util");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const validateFlatPermissionFlagDeletion = ({ flatEntityToValidate: { universalIdentifier }, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps }, buildOptions })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier
        },
        metadataName: 'permissionFlag',
        type: 'delete'
    });
    const existing = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier,
        flatEntityMaps: optimisticFlatPermissionFlagMaps
    });
    if (!(0, _utils.isDefined)(existing)) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_NOT_FOUND,
            message: _core.i18n._(/*i18n*/ {
                id: "dKSPBk",
                message: "Permission flag definition to delete not found"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "IPm2ty",
                message: "Permission flag definition not found"
            }
        });
        return validationResult;
    }
    if (!(0, _iscallertwentystandardapputil.isCallerTwentyStandardApp)(buildOptions) && (0, _belongstotwentystandardapputil.belongsToTwentyStandardApp)({
        universalIdentifier: existing.universalIdentifier,
        applicationUniversalIdentifier: existing.applicationUniversalIdentifier
    })) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_IS_STANDARD,
            message: _core.i18n._(/*i18n*/ {
                id: "kOOXTs",
                message: "Cannot delete standard permission flag definition"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "kOOXTs",
                message: "Cannot delete standard permission flag definition"
            }
        });
    }
    return validationResult;
};

//# sourceMappingURL=validate-flat-permission-flag-deletion.util.js.map