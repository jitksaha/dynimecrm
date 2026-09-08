"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "flatRoleHasPermissionFlag", {
    enumerable: true,
    get: function() {
        return flatRoleHasPermissionFlag;
    }
});
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const flatRoleHasPermissionFlag = ({ flatRole, permissionFlag, flatRolePermissionFlagMaps })=>{
    const permissionFlagUniversalIdentifier = _constants.SystemPermissionFlag[permissionFlag];
    return flatRole.rolePermissionFlagIds.some((rolePermissionFlagId)=>{
        const rolePermissionFlagUniversalIdentifier = flatRolePermissionFlagMaps.universalIdentifierById[rolePermissionFlagId];
        if (!(0, _utils.isDefined)(rolePermissionFlagUniversalIdentifier)) {
            return false;
        }
        return flatRolePermissionFlagMaps.byUniversalIdentifier[rolePermissionFlagUniversalIdentifier]?.permissionFlagUniversalIdentifier === permissionFlagUniversalIdentifier;
    });
};

//# sourceMappingURL=flat-role-has-permission-flag.util.js.map