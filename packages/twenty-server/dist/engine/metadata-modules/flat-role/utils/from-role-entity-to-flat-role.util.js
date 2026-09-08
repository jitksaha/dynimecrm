"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRoleEntityToFlatRole", {
    enumerable: true,
    get: function() {
        return fromRoleEntityToFlatRole;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromRoleEntityToFlatRole = (args)=>{
    const { entity: roleEntity } = args;
    const roleScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'role',
        entity: roleEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'role',
        ...args
    });
    return {
        ...roleScalarEntity,
        ...relationUniversalIdentifiers,
        roleTargetIds: roleEntity.roleTargets.map(({ id })=>id),
        objectPermissionIds: roleEntity.objectPermissions.map(({ id })=>id),
        rolePermissionFlagIds: roleEntity.rolePermissionFlags.map(({ id })=>id),
        fieldPermissionIds: roleEntity.fieldPermissions.map(({ id })=>id),
        rowLevelPermissionPredicateIds: roleEntity.rowLevelPermissionPredicates.map(({ id })=>id),
        rowLevelPermissionPredicateGroupIds: roleEntity.rowLevelPermissionPredicateGroups.map(({ id })=>id),
        roleTargetUniversalIdentifiers: roleEntity.roleTargets.map(({ universalIdentifier })=>universalIdentifier),
        objectPermissionUniversalIdentifiers: roleEntity.objectPermissions.map(({ universalIdentifier })=>universalIdentifier),
        rolePermissionFlagUniversalIdentifiers: roleEntity.rolePermissionFlags.map(({ universalIdentifier })=>universalIdentifier),
        fieldPermissionUniversalIdentifiers: roleEntity.fieldPermissions.map(({ universalIdentifier })=>universalIdentifier),
        rowLevelPermissionPredicateUniversalIdentifiers: roleEntity.rowLevelPermissionPredicates.map(({ universalIdentifier })=>universalIdentifier),
        rowLevelPermissionPredicateGroupUniversalIdentifiers: roleEntity.rowLevelPermissionPredicateGroups.map(({ universalIdentifier })=>universalIdentifier)
    };
};

//# sourceMappingURL=from-role-entity-to-flat-role.util.js.map