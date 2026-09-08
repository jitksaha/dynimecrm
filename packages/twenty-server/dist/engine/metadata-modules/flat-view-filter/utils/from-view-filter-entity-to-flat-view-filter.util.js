"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewFilterEntityToFlatViewFilter", {
    enumerable: true,
    get: function() {
        return fromViewFilterEntityToFlatViewFilter;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewFilterEntityToFlatViewFilter = (args)=>{
    const { entity: viewFilterEntity } = args;
    const viewFilterScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'viewFilter',
        entity: viewFilterEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'viewFilter',
        ...args
    });
    return {
        ...viewFilterScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-view-filter-entity-to-flat-view-filter.util.js.map