"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFieldMetadataEntityToFlatFieldMetadata", {
    enumerable: true,
    get: function() {
        return fromFieldMetadataEntityToFlatFieldMetadata;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _isfieldmetadatasettingsoftypeutil = require("../../field-metadata/utils/is-field-metadata-settings-of-type.util");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromFieldMetadataEntityToFlatFieldMetadata = (args)=>{
    const { entity: fieldMetadataEntity, fieldMetadataIdToUniversalIdentifierMap } = args;
    const fieldMetadataScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'fieldMetadata',
        entity: fieldMetadataEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'fieldMetadata',
        ...args
    });
    const settings = fieldMetadataEntity.settings;
    const isRelationSettings = (0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(settings, _types.FieldMetadataType.RELATION) || (0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(settings, _types.FieldMetadataType.MORPH_RELATION);
    const settingsWithUniversalIdentifiers = isRelationSettings ? {
        ...settings,
        ...(0, _utils.isDefined)(settings.junctionTargetFieldId) && {
            junctionTargetFieldUniversalIdentifier: fieldMetadataIdToUniversalIdentifierMap.get(settings.junctionTargetFieldId)
        }
    } : settings;
    return {
        ...fieldMetadataScalarEntity,
        ...relationUniversalIdentifiers,
        kanbanAggregateOperationViewIds: fieldMetadataEntity.kanbanAggregateOperationViews.map(({ id })=>id),
        calendarViewIds: fieldMetadataEntity.calendarViews.map(({ id })=>id),
        calendarEndViewIds: fieldMetadataEntity.calendarEndViews.map(({ id })=>id),
        mainGroupByFieldMetadataViewIds: fieldMetadataEntity.mainGroupByFieldMetadataViews?.map(({ id })=>id) ?? [],
        viewFieldIds: fieldMetadataEntity.viewFields.map(({ id })=>id),
        viewFilterIds: fieldMetadataEntity.viewFilters.map(({ id })=>id),
        fieldPermissionIds: fieldMetadataEntity.fieldPermissions?.map(({ id })=>id) ?? [],
        viewFieldUniversalIdentifiers: fieldMetadataEntity.viewFields.map(({ universalIdentifier })=>universalIdentifier),
        viewFilterUniversalIdentifiers: fieldMetadataEntity.viewFilters.map(({ universalIdentifier })=>universalIdentifier),
        kanbanAggregateOperationViewUniversalIdentifiers: fieldMetadataEntity.kanbanAggregateOperationViews.map(({ universalIdentifier })=>universalIdentifier),
        calendarViewUniversalIdentifiers: fieldMetadataEntity.calendarViews.map(({ universalIdentifier })=>universalIdentifier),
        calendarEndViewUniversalIdentifiers: fieldMetadataEntity.calendarEndViews.map(({ universalIdentifier })=>universalIdentifier),
        mainGroupByFieldMetadataViewUniversalIdentifiers: fieldMetadataEntity.mainGroupByFieldMetadataViews?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        viewSortIds: fieldMetadataEntity.viewSorts?.map(({ id })=>id) ?? [],
        viewSortUniversalIdentifiers: fieldMetadataEntity.viewSorts?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        searchFieldMetadataIds: fieldMetadataEntity.searchFieldMetadatas?.map(({ id })=>id) ?? [],
        searchFieldMetadataUniversalIdentifiers: fieldMetadataEntity.searchFieldMetadatas?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        fieldPermissionUniversalIdentifiers: fieldMetadataEntity.fieldPermissions?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        universalSettings: settingsWithUniversalIdentifiers
    };
};

//# sourceMappingURL=from-field-metadata-entity-to-flat-field-metadata.util.js.map