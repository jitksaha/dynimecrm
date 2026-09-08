"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewSortEntityToFlatViewSort", {
    enumerable: true,
    get: function() {
        return fromViewSortEntityToFlatViewSort;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewSortEntityToFlatViewSort = (args)=>{
    const { entity: viewSortEntity } = args;
    const viewSortScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'viewSort',
        entity: viewSortEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'viewSort',
        ...args
    });
    return {
        ...viewSortScalarEntity,
        ...relationUniversalIdentifiers
    };
};

//# sourceMappingURL=from-view-sort-entity-to-flat-view-sort.util.js.map