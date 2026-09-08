"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveObjectRecordsPermissions", {
    enumerable: true,
    get: function() {
        return resolveObjectRecordsPermissions;
    }
});
const _utils = require("twenty-shared/utils");
const _computepermissionintersectionutil = require("./compute-permission-intersection.util");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const resolveObjectRecordsPermissions = ({ rolePermissionConfig, objectPermissionsByRoleId })=>{
    if (!(0, _utils.isDefined)(rolePermissionConfig)) {
        return {
            objectRecordsPermissions: {},
            shouldBypassPermissionChecks: false
        };
    }
    if ('shouldBypassPermissionChecks' in rolePermissionConfig) {
        return {
            objectRecordsPermissions: {},
            shouldBypassPermissionChecks: rolePermissionConfig.shouldBypassPermissionChecks
        };
    }
    if ('unionOf' in rolePermissionConfig) {
        if (rolePermissionConfig.unionOf.length !== 1) {
            throw new _twentyormexception.TwentyOrmException('Union permission logic for multiple roles not yet implemented', _twentyormexception.TwentyOrmExceptionCode.UNSUPPORTED_OPERATION);
        }
        return {
            objectRecordsPermissions: objectPermissionsByRoleId[rolePermissionConfig.unionOf[0]] ?? {},
            shouldBypassPermissionChecks: false
        };
    }
    const allRolePermissions = rolePermissionConfig.intersectionOf.map((roleId)=>objectPermissionsByRoleId[roleId]);
    return {
        objectRecordsPermissions: allRolePermissions.every(_utils.isDefined) ? (0, _computepermissionintersectionutil.computePermissionIntersection)(allRolePermissions) : {},
        shouldBypassPermissionChecks: false
    };
};

//# sourceMappingURL=resolve-object-records-permissions.util.js.map