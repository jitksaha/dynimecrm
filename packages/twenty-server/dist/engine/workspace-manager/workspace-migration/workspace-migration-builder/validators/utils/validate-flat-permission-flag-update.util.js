"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatPermissionFlagUpdate", {
    enumerable: true,
    get: function() {
        return validateFlatPermissionFlagUpdate;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _permissionflagpermissiontypeconstant = require("../../../../../metadata-modules/permission-flag/constants/permission-flag-permission-type.constant");
const _permissionflagexception = require("../../../../../metadata-modules/permission-flag/permission-flag.exception");
const _belongstotwentystandardapputil = require("../../../../../metadata-modules/utils/belongs-to-twenty-standard-app.util");
const _iscallertwentystandardapputil = require("../../../../../metadata-modules/utils/is-caller-twenty-standard-app.util");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const validateFlatPermissionFlagUpdate = ({ universalIdentifier, flatEntityUpdate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps }, buildOptions })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier
        },
        metadataName: 'permissionFlag',
        type: 'update'
    });
    const existing = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier,
        flatEntityMaps: optimisticFlatPermissionFlagMaps
    });
    if (!(0, _utils.isDefined)(existing)) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_NOT_FOUND,
            message: _core.i18n._(/*i18n*/ {
                id: "5phRcJ",
                message: "Permission flag definition to update not found"
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
                id: "LWpSNC",
                message: "Cannot update standard permission flag definition"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "LWpSNC",
                message: "Cannot update standard permission flag definition"
            }
        });
    }
    if ((0, _utils.isDefined)(flatEntityUpdate.key) && flatEntityUpdate.key !== existing.key) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_KEY_IMMUTABLE,
            message: _core.i18n._(/*i18n*/ {
                id: "si69+A",
                message: "Permission flag definition key cannot be changed after creation"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "WDgCbh",
                message: "Key cannot be changed"
            }
        });
    }
    if ((0, _utils.isDefined)(flatEntityUpdate.permissionType) && !_permissionflagpermissiontypeconstant.PERMISSION_FLAG_PERMISSION_TYPES.includes(flatEntityUpdate.permissionType)) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.INVALID_PERMISSION_FLAG_PERMISSION_TYPE,
            message: _core.i18n._(/*i18n*/ {
                id: "/amTA5",
                message: "Permission flag definition permission type must be 'settings' or 'tool'"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "ZoXxz9",
                message: "Invalid permission type"
            }
        });
    }
    return validationResult;
};

//# sourceMappingURL=validate-flat-permission-flag-update.util.js.map