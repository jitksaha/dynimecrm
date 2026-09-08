"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validatePermissionFlagNotInUseCrossEntity", {
    enumerable: true,
    get: function() {
        return validatePermissionFlagNotInUseCrossEntity;
    }
});
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _permissionflagexception = require("../../../permission-flag/permission-flag.exception");
const _getflatentityvalidationerrorutil = require("../../../../workspace-manager/workspace-migration/workspace-migration-builder/builders/utils/get-flat-entity-validation-error.util");
const validatePermissionFlagNotInUseCrossEntity = ({ optimisticUniversalFlatMaps, deletedPermissionFlagActions })=>{
    const validationErrors = {
        permissionFlag: []
    };
    if (deletedPermissionFlagActions.length === 0) {
        return validationErrors;
    }
    const survivingRolePermissionFlags = Object.values(optimisticUniversalFlatMaps.flatRolePermissionFlagMaps.byUniversalIdentifier).filter(_utils.isDefined);
    for (const deleteAction of deletedPermissionFlagActions){
        const isStillReferenced = survivingRolePermissionFlags.some((rolePermissionFlag)=>rolePermissionFlag.permissionFlagUniversalIdentifier === deleteAction.universalIdentifier);
        if (!isStillReferenced) {
            continue;
        }
        const flagKey = deleteAction.flatEntity?.key ?? deleteAction.universalIdentifier;
        const failedValidation = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: deleteAction.universalIdentifier,
                key: deleteAction.flatEntity?.key
            },
            metadataName: 'permissionFlag',
            type: 'delete'
        });
        failedValidation.errors.push({
            code: _permissionflagexception.PermissionFlagExceptionCode.PERMISSION_FLAG_IN_USE,
            message: _core.i18n._(/*i18n*/ {
                id: "wz0wTT",
                message: "Permission flag definition with key {flagKey} is still assigned to a role",
                values: {
                    flagKey: flagKey
                }
            }),
            userFriendlyMessage: /*i18n*/ {
                id: "yFLhnq",
                message: "Remove this permission from all roles before deleting it"
            }
        });
        validationErrors.permissionFlag.push(failedValidation);
    }
    return validationErrors;
};

//# sourceMappingURL=validate-permission-flag-not-in-use-cross-entity.util.js.map