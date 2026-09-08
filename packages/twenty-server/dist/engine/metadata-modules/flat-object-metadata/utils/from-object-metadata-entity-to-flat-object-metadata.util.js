"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromObjectMetadataEntityToFlatObjectMetadata", {
    enumerable: true,
    get: function() {
        return fromObjectMetadataEntityToFlatObjectMetadata;
    }
});
const _utils = require("twenty-shared/utils");
const _fromentitytoscalarentityutil = require("../../flat-entity/utils/from-entity-to-scalar-entity.util");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../../../workspace-manager/workspace-migration/universal-flat-entity/utils/resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const fromObjectMetadataEntityToFlatObjectMetadata = (args)=>{
    const { entity: objectMetadataEntity, fieldMetadataIdToUniversalIdentifierMap } = args;
    const objectMetadataScalarEntity = (0, _fromentitytoscalarentityutil.fromEntityToScalarEntity)({
        metadataName: 'objectMetadata',
        entity: objectMetadataEntity
    });
    const relationUniversalIdentifiers = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)({
        metadataName: 'objectMetadata',
        ...args
    });
    // labelIdentifier/imageIdentifier are soft field references (not modeled
    // relations) resolved without throwing on missing identifiers
    let labelIdentifierFieldMetadataUniversalIdentifier = null;
    if ((0, _utils.isDefined)(objectMetadataEntity.labelIdentifierFieldMetadataId)) {
        labelIdentifierFieldMetadataUniversalIdentifier = fieldMetadataIdToUniversalIdentifierMap.get(objectMetadataEntity.labelIdentifierFieldMetadataId) ?? null;
    // TODO uncomment once https://github.com/twentyhq/core-team-issues/issues/2172 has been resolved
    // if (!isDefined(labelIdentifierFieldMetadataUniversalIdentifier)) {
    //   throw new FlatEntityMapsException(
    //     `Label identifier field metadata with id ${objectMetadataEntity.labelIdentifierFieldMetadataId} not found when building flat object metadata for object ${objectMetadataEntity.id}`,
    //     FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND,
    //   );
    // }
    }
    let imageIdentifierFieldMetadataUniversalIdentifier = null;
    if ((0, _utils.isDefined)(objectMetadataEntity.imageIdentifierFieldMetadataId)) {
        imageIdentifierFieldMetadataUniversalIdentifier = fieldMetadataIdToUniversalIdentifierMap.get(objectMetadataEntity.imageIdentifierFieldMetadataId) ?? null;
    // TODO uncomment once https://github.com/twentyhq/core-team-issues/issues/2172 has been resolved
    // if (!isDefined(imageIdentifierFieldMetadataUniversalIdentifier)) {
    //   throw new FlatEntityMapsException(
    //     `Image identifier field metadata with id ${objectMetadataEntity.imageIdentifierFieldMetadataId} not found when building flat object metadata for object ${objectMetadataEntity.id}`,
    //     FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND,
    //   );
    // }
    }
    return {
        ...objectMetadataScalarEntity,
        ...relationUniversalIdentifiers,
        labelIdentifierFieldMetadataUniversalIdentifier,
        imageIdentifierFieldMetadataUniversalIdentifier,
        viewIds: objectMetadataEntity.views.map(({ id })=>id),
        indexMetadataIds: objectMetadataEntity.indexMetadatas.map(({ id })=>id),
        searchFieldMetadataIds: objectMetadataEntity.searchFieldMetadatas.map(({ id })=>id),
        fieldIds: objectMetadataEntity.fields.map(({ id })=>id),
        objectPermissionIds: objectMetadataEntity.objectPermissions.map(({ id })=>id),
        fieldPermissionIds: objectMetadataEntity.fieldPermissions?.map(({ id })=>id) ?? [],
        pageLayoutIds: objectMetadataEntity.pageLayouts.map(({ id })=>id),
        fieldUniversalIdentifiers: objectMetadataEntity.fields.map(({ universalIdentifier })=>universalIdentifier),
        indexMetadataUniversalIdentifiers: objectMetadataEntity.indexMetadatas.map(({ universalIdentifier })=>universalIdentifier),
        searchFieldMetadataUniversalIdentifiers: objectMetadataEntity.searchFieldMetadatas?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        viewUniversalIdentifiers: objectMetadataEntity.views.map(({ universalIdentifier })=>universalIdentifier),
        objectPermissionUniversalIdentifiers: objectMetadataEntity.objectPermissions.map(({ universalIdentifier })=>universalIdentifier),
        fieldPermissionUniversalIdentifiers: objectMetadataEntity.fieldPermissions?.map(({ universalIdentifier })=>universalIdentifier) ?? [],
        pageLayoutUniversalIdentifiers: objectMetadataEntity.pageLayouts.map(({ universalIdentifier })=>universalIdentifier),
        commandMenuItemIds: objectMetadataEntity.commandMenuItems?.map(({ id })=>id) ?? [],
        commandMenuItemUniversalIdentifiers: objectMetadataEntity.commandMenuItems?.map(({ universalIdentifier })=>universalIdentifier) ?? []
    };
};

//# sourceMappingURL=from-object-metadata-entity-to-flat-object-metadata.util.js.map