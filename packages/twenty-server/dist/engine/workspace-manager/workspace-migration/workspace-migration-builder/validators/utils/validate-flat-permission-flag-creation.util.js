"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateFlatPermissionFlagCreation", {
    enumerable: true,
    get: function() {
        return validateFlatPermissionFlagCreation;
    }
});
const _core = require("@lingui/core");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _permissionflagpermissiontypeconstant = require("../../../../../metadata-modules/permission-flag/constants/permission-flag-permission-type.constant");
const _permissionflagexception = require("../../../../../metadata-modules/permission-flag/permission-flag.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
const validateFlatPermissionFlagCreation = ({ flatEntityToValidate: flatPermissionFlagToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps } })=>{
    const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
        flatEntityMinimalInformation: {
            universalIdentifier: flatPermissionFlagToValidate.universalIdentifier,
            key: flatPermissionFlagToValidate.key
        },
        metadataName: 'permissionFlag',
        type: 'create'
    });
    const existingByUniversalId = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        universalIdentifier: flatPermissionFlagToValidate.universalIdentifier,
        flatEntityMaps: optimisticFlatPermissionFlagMaps
    });
    if ((0, _utils.isDefined)(existingByUniversalId)) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_ALREADY_EXISTS,
            message: _core.i18n._(/*i18n*/ {
                id: "px8Wqt",
                message: "Permission flag definition with universal identifier {0} already exists",
                values: {
                    0: flatPermissionFlagToValidate.universalIdentifier
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "vUfYBs",
                message: "Permission flag definition already exists"
            }
        });
    }
    if (!(0, _guards.isNonEmptyString)(flatPermissionFlagToValidate.key)) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.INVALID_PERMISSION_FLAG_KEY,
            message: _core.i18n._(/*i18n*/ {
                id: "vCvEfM",
                message: "Permission flag definition key is required"
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "QV1ZPO",
                message: "Key is required"
            }
        });
    }
    const collidingPermissionFlag = Object.values(optimisticFlatPermissionFlagMaps.byUniversalIdentifier).find((definition)=>(0, _utils.isDefined)(definition) && definition.key === flatPermissionFlagToValidate.key && definition.universalIdentifier !== flatPermissionFlagToValidate.universalIdentifier);
    if ((0, _utils.isDefined)(collidingPermissionFlag)) {
        validationResult.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_ALREADY_EXISTS,
            message: _core.i18n._(/*i18n*/ {
                id: "KNBagU",
                message: 'Permission flag definition with key "{0}" is already registered in this workspace.',
                values: {
                    0: flatPermissionFlagToValidate.key
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "4XvK/4",
                message: "Another application in this workspace has already registered a permission flag with this key."
            }
        });
    }
    if (!_permissionflagpermissiontypeconstant.PERMISSION_FLAG_PERMISSION_TYPES.includes(flatPermissionFlagToValidate.permissionType)) {
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

//# sourceMappingURL=validate-flat-permission-flag-creation.util.js.map