"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFieldPermissionEntityToFlatFieldPermission", {
    enumerable: true,
    get: function() {
        return fromFieldPermissionEntityToFlatFieldPermission;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromFieldPermissionEntityToFlatFieldPermission = (args)=>{
    const { entity: fieldPermissionEntity } = args;
    const fieldPermissionScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'fieldPermission',
        entity: fieldPermissionEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'fieldPermission',
        ...args
    });
    return {
        ...fieldPermissionScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-field-permission-entity-to-flat-field-permission.util.js.map