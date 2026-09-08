"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewFilterGroupEntityToFlatViewFilterGroup", {
    enumerable: true,
    get: function() {
        return fromViewFilterGroupEntityToFlatViewFilterGroup;
    }
});
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewFilterGroupEntityToFlatViewFilterGroup = (args)=>{
    const { entity: viewFilterGroupEntity } = args;
    const viewFilterGroupScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'viewFilterGroup',
        entity: viewFilterGroupEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'viewFilterGroup',
        ...args
    });
    return {
        ...viewFilterGroupScalarEntity,
        ...relationUniversalIdentifiers,
        viewFilterIds: viewFilterGroupEntity.viewFilters?.map(({ id })=>id) ?? [],
        childViewFilterGroupIds: viewFilterGroupEntity.childViewFilterGroups?.map(({ id })=>id) ?? [],
        viewFilterUniversalIdentifiers: viewFilterGroupEntity.viewFilters?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        childViewFilterGroupUniversalIdentifiers: viewFilterGroupEntity.childViewFilterGroups?.map(({ universalIdentifier })=>universalIdentifier) ?? []
    };
};

//# sourceMappingURL=from-view-filter-group-entity-to-flat-view-filter-group.util.js.map