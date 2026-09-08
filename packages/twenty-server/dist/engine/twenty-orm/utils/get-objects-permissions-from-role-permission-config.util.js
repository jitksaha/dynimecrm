"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getObjectsPermissionsFromRolePermissionConfig", {
    enumerable: true,
    get: function() {
        return getObjectsPermissionsFromRolePermissionConfig;
    }
});
const _utils = require("twenty-shared/utils");
const _computepermissionintersectionutil = require("./compute-permission-intersection.util");
const getObjectsPermissionsFromRolePermissionConfig = ({ rolesPermissions, rolePermissionConfig })=>{
    if ('shouldBypassPermissionChecks' in rolePermissionConfig) {
        return {};
    }
    if ('intersectionOf' in rolePermissionConfig) {
        const permissionsPerRole = rolePermissionConfig.intersectionOf.map((roleId)=>rolesPermissions[roleId]).filter(_utils.isDefined);
        if (!(0, _utils.isNonEmptyArray)(permissionsPerRole) || permissionsPerRole.length !== rolePermissionConfig.intersectionOf.length) {
            return {};
        }
        return (0, _computepermissionintersectionutil.computePermissionIntersection)(permissionsPerRole);
    }
    // Multi-role union is unimplemented and every producer emits one role, so
    // taking the first is exact rather than lossy.
    if ('unionOf' in rolePermissionConfig) {
        const roleId = rolePermissionConfig.unionOf[0];
        return (0, _utils.isDefined)(roleId) ? rolesPermissions[roleId] ?? {} : {};
    }
    return {};
};

//# sourceMappingURL=get-objects-permissions-from-role-permission-config.util.js.map