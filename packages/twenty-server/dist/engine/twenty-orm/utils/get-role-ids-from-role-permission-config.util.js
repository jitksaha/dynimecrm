"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRoleIdsFromRolePermissionConfig", {
    enumerable: true,
    get: function() {
        return getRoleIdsFromRolePermissionConfig;
    }
});
const getRoleIdsFromRolePermissionConfig = (rolePermissionConfig)=>{
    if ('intersectionOf' in rolePermissionConfig) {
        return rolePermissionConfig.intersectionOf;
    }
    if ('unionOf' in rolePermissionConfig) {
        return rolePermissionConfig.unionOf;
    }
    return [];
};

//# sourceMappingURL=get-role-ids-from-role-permission-config.util.js.map