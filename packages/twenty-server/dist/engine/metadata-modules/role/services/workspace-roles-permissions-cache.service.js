"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceRolesPermissionsCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceRolesPermissionsCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _constants = require("twenty-shared/constants");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const WORKFLOW_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
    _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
    _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier
];
const WORKSPACE_MEMBER_OBJECT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.workspaceMember.universalIdentifier;
const ROLES_PERMISSIONS_ROWS_REQUIREMENT = {
    role: true,
    objectPermission: {
        columns: true,
        groupBy: [
            'roleId'
        ]
    },
    rolePermissionFlag: {
        columns: true,
        groupBy: [
            'roleId'
        ]
    },
    permissionFlag: true,
    fieldPermission: {
        columns: true,
        groupBy: [
            'roleId'
        ]
    },
    rowLevelPermissionPredicate: {
        columns: true,
        groupBy: [
            'roleId'
        ],
        where: {
            deletedAt: (0, _typeorm.IsNull)()
        }
    },
    rowLevelPermissionPredicateGroup: {
        columns: true,
        groupBy: [
            'roleId'
        ],
        where: {
            deletedAt: (0, _typeorm.IsNull)()
        }
    },
    objectMetadata: [
        'id',
        'isSystem',
        'universalIdentifier',
        'labelIdentifierFieldMetadataId'
    ]
};
let WorkspaceRolesPermissionsCacheService = class WorkspaceRolesPermissionsCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    computeForCache({ rows }) {
        const { role: roles, objectPermission: objectPermissions, rolePermissionFlag: rolePermissionFlags, permissionFlag: permissionFlags, fieldPermission: fieldPermissions, rowLevelPermissionPredicate: rowLevelPermissionPredicates, rowLevelPermissionPredicateGroup: rowLevelPermissionPredicateGroups, objectMetadata: workspaceObjectMetadataCollection } = rows;
        const permissionFlagById = new Map(permissionFlags.map((permissionFlag)=>[
                permissionFlag.id,
                permissionFlag
            ]));
        const permissionsByRoleId = {};
        for (const role of roles){
            const roleObjectPermissions = objectPermissions.byRoleId.get(role.id) ?? [];
            const roleRolePermissionFlags = (rolePermissionFlags.byRoleId.get(role.id) ?? []).map((rolePermissionFlagRow)=>({
                    ...rolePermissionFlagRow,
                    permissionFlag: permissionFlagById.get(rolePermissionFlagRow.permissionFlagId)
                }));
            const roleFieldPermissions = fieldPermissions.byRoleId.get(role.id) ?? [];
            const roleRowLevelPermissionPredicates = rowLevelPermissionPredicates.byRoleId.get(role.id) ?? [];
            const roleRowLevelPermissionPredicateGroups = rowLevelPermissionPredicateGroups.byRoleId.get(role.id) ?? [];
            const objectRecordsPermissions = {};
            for (const objectMetadata of workspaceObjectMetadataCollection){
                const { id: objectMetadataId, isSystem, universalIdentifier } = objectMetadata;
                let canRead = role.canReadAllObjectRecords;
                let canUpdate = role.canUpdateAllObjectRecords;
                let canSoftDelete = role.canSoftDeleteAllObjectRecords;
                let canDestroy = role.canDestroyAllObjectRecords;
                const restrictedFields = {};
                const isWorkspaceMemberObject = universalIdentifier === WORKSPACE_MEMBER_OBJECT_UNIVERSAL_IDENTIFIER;
                const isWorkflowRelatedObject = WORKFLOW_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.includes(universalIdentifier);
                if (isWorkflowRelatedObject) {
                    const hasWorkflowsPermissions = this.hasSettingsGatedObjectPermissions(role, roleRolePermissionFlags, _constants.PermissionFlagType.WORKFLOWS);
                    canRead = hasWorkflowsPermissions;
                    canUpdate = hasWorkflowsPermissions;
                    canSoftDelete = hasWorkflowsPermissions;
                    canDestroy = hasWorkflowsPermissions;
                } else {
                    if (isWorkspaceMemberObject) {
                        const hasWorkspaceMembersPermissions = this.hasSettingsGatedObjectPermissions(role, roleRolePermissionFlags, _constants.PermissionFlagType.WORKSPACE_MEMBERS);
                        canRead = true;
                        canUpdate = hasWorkspaceMembersPermissions;
                        canSoftDelete = hasWorkspaceMembersPermissions;
                        canDestroy = hasWorkspaceMembersPermissions;
                    } else {
                        const objectRecordPermissionsOverride = roleObjectPermissions.find((objectPermission)=>objectPermission.objectMetadataId === objectMetadataId);
                        const getPermissionValue = (overrideValue, defaultValue)=>overrideValue ?? (isSystem ? true : defaultValue);
                        canRead = getPermissionValue(objectRecordPermissionsOverride?.canReadObjectRecords, canRead);
                        canUpdate = getPermissionValue(objectRecordPermissionsOverride?.canUpdateObjectRecords, canUpdate);
                        canSoftDelete = getPermissionValue(objectRecordPermissionsOverride?.canSoftDeleteObjectRecords, canSoftDelete);
                        canDestroy = getPermissionValue(objectRecordPermissionsOverride?.canDestroyObjectRecords, canDestroy);
                    }
                    const fieldPermissionsForObject = roleFieldPermissions.filter((fieldPermission)=>fieldPermission.objectMetadataId === objectMetadataId);
                    for (const fieldPermission of fieldPermissionsForObject){
                        const isFieldLabelIdentifier = fieldPermission.fieldMetadataId === objectMetadata.labelIdentifierFieldMetadataId;
                        if ((0, _utils.isDefined)(fieldPermission.canReadFieldValue) || (0, _utils.isDefined)(fieldPermission.canUpdateFieldValue)) {
                            restrictedFields[fieldPermission.fieldMetadataId] = {
                                canRead: isFieldLabelIdentifier ? true : fieldPermission.canReadFieldValue,
                                canUpdate: fieldPermission.canUpdateFieldValue
                            };
                        }
                    }
                }
                objectRecordsPermissions[objectMetadataId] = {
                    canReadObjectRecords: canRead,
                    canUpdateObjectRecords: canUpdate,
                    canSoftDeleteObjectRecords: canSoftDelete,
                    canDestroyObjectRecords: canDestroy,
                    restrictedFields,
                    rowLevelPermissionPredicates: roleRowLevelPermissionPredicates.filter((rowLevelPermissionPredicate)=>rowLevelPermissionPredicate.objectMetadataId === objectMetadataId),
                    rowLevelPermissionPredicateGroups: roleRowLevelPermissionPredicateGroups.filter((rowLevelPermissionPredicateGroup)=>rowLevelPermissionPredicateGroup.objectMetadataId === objectMetadataId)
                };
            }
            permissionsByRoleId[role.id] = objectRecordsPermissions;
        }
        return permissionsByRoleId;
    }
    hasSettingsGatedObjectPermissions(role, rolePermissionFlags, permissionFlagType) {
        const hasPermissionFromRole = role.canUpdateAllSettings;
        const permissionFlagUniversalIdentifier = _constants.SystemPermissionFlag[permissionFlagType];
        const hasPermissionFromSettingPermissions = (0, _utils.isDefined)(rolePermissionFlags.find((rolePermissionFlag)=>this.getRolePermissionFlagUniversalIdentifier(rolePermissionFlag) === permissionFlagUniversalIdentifier));
        return hasPermissionFromRole || hasPermissionFromSettingPermissions;
    }
    getRolePermissionFlagUniversalIdentifier(rolePermissionFlag) {
        // The `permissionFlag` relation is stripped during upgrades until the 2.6.0
        // cursor (@WasIntroducedInUpgrade), so fall back to the legacy `flag` column.
        return rolePermissionFlag.permissionFlag?.universalIdentifier ?? _constants.SystemPermissionFlag[rolePermissionFlag.flag];
    }
    constructor(...args){
        super(...args), this.rowsRequirement = ROLES_PERMISSIONS_ROWS_REQUIREMENT;
    }
};
WorkspaceRolesPermissionsCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('rolesPermissions', {
        packingPonderation: 2
    })
], WorkspaceRolesPermissionsCacheService);

//# sourceMappingURL=workspace-roles-permissions-cache.service.js.map