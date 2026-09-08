"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRolePermissionFlagEntityToFlatRolePermissionFlag", {
    enumerable: true,
    get: function() {
        return fromRolePermissionFlagEntityToFlatRolePermissionFlag;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromRolePermissionFlagEntityToFlatRolePermissionFlag = (args)=>{
    const { entity: rolePermissionFlagEntity } = args;
    const rolePermissionFlagScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'rolePermissionFlag',
        entity: rolePermissionFlagEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'rolePermissionFlag',
        ...args
    });
    return {
        ...rolePermissionFlagScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-role-permission-flag-entity-to-flat-role-permission-flag.util.js.map