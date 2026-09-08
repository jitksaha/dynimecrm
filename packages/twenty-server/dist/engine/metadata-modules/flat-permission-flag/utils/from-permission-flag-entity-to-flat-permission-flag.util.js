"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromPermissionFlagEntityToFlatPermissionFlag", {
    enumerable: true,
    get: function() {
        return fromPermissionFlagEntityToFlatPermissionFlag;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromPermissionFlagEntityToFlatPermissionFlag = (args)=>{
    const { entity: permissionFlagEntity } = args;
    const permissionFlagScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'permissionFlag',
        entity: permissionFlagEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'permissionFlag',
        ...args
    });
    return {
        ...permissionFlagScalarEntity,
        ...relationUniversalIdentifiers,
        rolePermissionFlagIds: permissionFlagEntity.rolePermissionFlags.map(({ id })=>id),
        rolePermissionFlagUniversalIdentifiers: permissionFlagEntity.rolePermissionFlags.map(({ universalIdentifier })=>universalIdentifier)
    };
};

//# sourceMappingURL=from-permission-flag-entity-to-flat-permission-flag.util.js.map