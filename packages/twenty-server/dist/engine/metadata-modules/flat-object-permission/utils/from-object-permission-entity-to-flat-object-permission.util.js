"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromObjectPermissionEntityToFlatObjectPermission", {
    enumerable: true,
    get: function() {
        return fromObjectPermissionEntityToFlatObjectPermission;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromObjectPermissionEntityToFlatObjectPermission = (args)=>{
    const { entity: objectPermissionEntity } = args;
    const objectPermissionScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'objectPermission',
        entity: objectPermissionEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'objectPermission',
        ...args
    });
    return {
        ...objectPermissionScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-object-permission-entity-to-flat-object-permission.util.js.map