"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewGroupEntityToFlatViewGroup", {
    enumerable: true,
    get: function() {
        return fromViewGroupEntityToFlatViewGroup;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewGroupEntityToFlatViewGroup = (args)=>{
    const { entity: viewGroupEntity } = args;
    const viewGroupScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'viewGroup',
        entity: viewGroupEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'viewGroup',
        ...args
    });
    return {
        ...viewGroupScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-view-group-entity-to-flat-view-group.util.js.map