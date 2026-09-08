"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromRoleTargetEntityToFlatRoleTarget", {
    enumerable: true,
    get: function() {
        return fromRoleTargetEntityToFlatRoleTarget;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromRoleTargetEntityToFlatRoleTarget = (args)=>{
    const { entity: roleTargetEntity } = args;
    const roleTargetScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'roleTarget',
        entity: roleTargetEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'roleTarget',
        ...args
    });
    return {
        ...roleTargetScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-role-target-entity-to-flat-role-target.util.js.map