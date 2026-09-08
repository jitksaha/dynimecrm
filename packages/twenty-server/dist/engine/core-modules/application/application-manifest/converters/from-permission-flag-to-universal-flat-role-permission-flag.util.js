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
    get ROLE_PERMISSION_FLAG_UUID_NAMESPACE () {
        return ROLE_PERMISSION_FLAG_UUID_NAMESPACE;
    },
    get fromPermissionFlagToUniversalFlatRolePermissionFlag () {
        return fromPermissionFlagToUniversalFlatRolePermissionFlag;
    }
});
const _uuid = require("uuid");
const ROLE_PERMISSION_FLAG_UUID_NAMESPACE = 'b9a3b3b3-58a3-4f6c-9c1f-3a4f6c9c1f3a';
const fromPermissionFlagToUniversalFlatRolePermissionFlag = ({ permissionFlagUniversalIdentifier, roleUniversalIdentifier, applicationUniversalIdentifier, now })=>{
    const universalIdentifier = (0, _uuid.v5)(`${roleUniversalIdentifier}:${permissionFlagUniversalIdentifier}`, ROLE_PERMISSION_FLAG_UUID_NAMESPACE);
    return {
        universalIdentifier,
        applicationUniversalIdentifier,
        roleUniversalIdentifier,
        permissionFlagUniversalIdentifier,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-permission-flag-to-universal-flat-role-permission-flag.util.js.map