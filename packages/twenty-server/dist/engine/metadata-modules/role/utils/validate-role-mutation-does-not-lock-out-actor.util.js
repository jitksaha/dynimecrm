"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get validateRoleDeletionDoesNotLockOutActorOrThrow () {
        return validateRoleDeletionDoesNotLockOutActorOrThrow;
    },
    get validateRoleUpdateDoesNotLockOutActorOrThrow () {
        return validateRoleUpdateDoesNotLockOutActorOrThrow;
    }
});
const _constants = require("twenty-shared/constants");
const _flatrolehaspermissionflagutil = require("../../flat-role/utils/flat-role-has-permission-flag.util");
const _permissionsexception = require("../../permissions/permissions.exception");
const validateRoleDeletionDoesNotLockOutActorOrThrow = ({ flatRole, actingRoleIds })=>{
    if (!flatRole.isEditable || !actingRoleIds?.includes(flatRole.id)) {
        return;
    }
    throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.CANNOT_DELETE_OWN_ROLE, _permissionsexception.PermissionsExceptionCode.CANNOT_DELETE_OWN_ROLE);
};
const validateRoleUpdateDoesNotLockOutActorOrThrow = ({ flatRole, canUpdateAllSettingsUpdate, actingRoleIds, flatRolePermissionFlagMaps })=>{
    if (!flatRole.isEditable || !actingRoleIds?.includes(flatRole.id)) {
        return;
    }
    if (canUpdateAllSettingsUpdate !== false || !flatRole.canUpdateAllSettings) {
        return;
    }
    const hasExplicitRolesPermissionFlag = (0, _flatrolehaspermissionflagutil.flatRoleHasPermissionFlag)({
        flatRole,
        permissionFlag: _constants.PermissionFlagType.ROLES,
        flatRolePermissionFlagMaps
    });
    if (!hasExplicitRolesPermissionFlag) {
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.CANNOT_REVOKE_OWN_SETTINGS_ACCESS, _permissionsexception.PermissionsExceptionCode.CANNOT_REVOKE_OWN_SETTINGS_ACCESS);
    }
};

//# sourceMappingURL=validate-role-mutation-does-not-lock-out-actor.util.js.map