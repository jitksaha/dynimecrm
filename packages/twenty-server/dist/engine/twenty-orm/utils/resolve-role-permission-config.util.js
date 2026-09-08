"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveRolePermissionConfig", {
    enumerable: true,
    get: function() {
        return resolveRolePermissionConfig;
    }
});
const _utils = require("twenty-shared/utils");
const _issystemauthcontextguard = require("../../core-modules/auth/guards/is-system-auth-context.guard");
const _resolveroleidsfromauthcontextutil = require("./resolve-role-ids-from-auth-context.util");
const resolveRolePermissionConfig = ({ authContext, userWorkspaceRoleMap, apiKeyRoleMap })=>{
    if ((0, _issystemauthcontextguard.isSystemAuthContext)(authContext)) {
        return {
            shouldBypassPermissionChecks: true
        };
    }
    const roleIds = (0, _resolveroleidsfromauthcontextutil.resolveRoleIdsFromAuthContext)({
        authContext,
        userWorkspaceRoleMap,
        apiKeyRoleMap
    });
    if (!(0, _utils.isNonEmptyArray)(roleIds)) {
        return null;
    }
    return {
        intersectionOf: roleIds
    };
};

//# sourceMappingURL=resolve-role-permission-config.util.js.map