"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromViewEntityToFlatView", {
    enumerable: true,
    get: function() {
        return fromViewEntityToFlatView;
    }
});
const _utils = require("twenty-shared/utils");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _fromviewoverridestouniversaloverridesutil = require("./from-view-overrides-to-universal-overrides.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromViewEntityToFlatView = (args)=>{
    const { entity: viewEntity, fieldMetadataIdToUniversalIdentifierMap } = args;
    const viewScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'view',
        entity: viewEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'view',
        ...args
    });
    const universalOverrides = (0, _utils.isDefined)(viewEntity.overrides) ? (0, _fromviewoverridestouniversaloverridesutil.fromViewOverridesToUniversalOverrides)({
        overrides: viewEntity.overrides,
        fieldMetadataUniversalIdentifierById: Object.fromEntries(fieldMetadataIdToUniversalIdentifierMap.entries()),
        shouldThrowOnMissingIdentifier: false
    }) : null;
    return {
        ...viewScalarEntity,
        ...relationUniversalIdentifiers,
        universalOverrides,
        viewFieldIds: viewEntity.viewFields.map(({ id })=>id),
        viewFieldGroupIds: viewEntity.viewFieldGroups?.map(({ id })=>id) ?? [],
        viewFilterIds: viewEntity.viewFilters.map(({ id })=>id),
        viewGroupIds: viewEntity.viewGroups.map(({ id })=>id),
        viewFilterGroupIds: viewEntity.viewFilterGroups?.map(({ id })=>id) ?? [],
        viewFieldUniversalIdentifiers: viewEntity.viewFields.map(({ universalIdentifier })=>universalIdentifier),
        viewFieldGroupUniversalIdentifiers: viewEntity.viewFieldGroups?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        viewFilterUniversalIdentifiers: viewEntity.viewFilters.map(({ universalIdentifier })=>universalIdentifier),
        viewGroupUniversalIdentifiers: viewEntity.viewGroups.map(({ universalIdentifier })=>universalIdentifier),
        viewFilterGroupUniversalIdentifiers: viewEntity.viewFilterGroups?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        viewSortIds: viewEntity.viewSorts?.map(({ id })=>id) ?? [],
        viewSortUniversalIdentifiers: viewEntity.viewSorts?.map(({ universalIdentifier })=>universalIdentifier) ?? []
    };
};

//# sourceMappingURL=from-view-entity-to-flat-view.util.js.map