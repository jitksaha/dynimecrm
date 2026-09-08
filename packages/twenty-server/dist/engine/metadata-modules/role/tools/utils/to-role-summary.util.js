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
    get toObjectPermissionSummary () {
        return toObjectPermissionSummary;
    },
    get toRoleSummary () {
        return toRoleSummary;
    }
});
const toObjectPermissionSummary = (objectPermission)=>({
        objectMetadataId: objectPermission.objectMetadataId,
        canReadObjectRecords: objectPermission.canReadObjectRecords,
        canUpdateObjectRecords: objectPermission.canUpdateObjectRecords,
        canSoftDeleteObjectRecords: objectPermission.canSoftDeleteObjectRecords,
        canDestroyObjectRecords: objectPermission.canDestroyObjectRecords
    });
const toRoleSummary = (role)=>({
        id: role.id,
        label: role.label,
        description: role.description,
        icon: role.icon,
        isEditable: role.isEditable,
        canUpdateAllSettings: role.canUpdateAllSettings,
        canAccessAllTools: role.canAccessAllTools,
        canReadAllObjectRecords: role.canReadAllObjectRecords,
        canUpdateAllObjectRecords: role.canUpdateAllObjectRecords,
        canSoftDeleteAllObjectRecords: role.canSoftDeleteAllObjectRecords,
        canDestroyAllObjectRecords: role.canDestroyAllObjectRecords,
        canBeAssignedToUsers: role.canBeAssignedToUsers,
        canBeAssignedToAgents: role.canBeAssignedToAgents,
        canBeAssignedToApiKeys: role.canBeAssignedToApiKeys,
        objectPermissions: role.objectPermissions?.map(toObjectPermissionSummary),
        permissionFlags: role.permissionFlags?.map((permissionFlag)=>permissionFlag.flag)
    });

//# sourceMappingURL=to-role-summary.util.js.map