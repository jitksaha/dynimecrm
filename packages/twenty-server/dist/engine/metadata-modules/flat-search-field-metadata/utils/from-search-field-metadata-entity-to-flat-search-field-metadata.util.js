"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromSearchFieldMetadataEntityToFlatSearchFieldMetadata", {
    enumerable: true,
    get: function() {
        return fromSearchFieldMetadataEntityToFlatSearchFieldMetadata;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const _getmetadataentityrelationpropertiesutil = require("../../flat-entity/utils/get-metadata-entity-relation-properties.util");
const fromSearchFieldMetadataEntityToFlatSearchFieldMetadata = ({ entity: searchFieldMetadataEntity, applicationIdToUniversalIdentifierMap, objectMetadataIdToUniversalIdentifierMap, fieldMetadataIdToUniversalIdentifierMap })=>{
    const searchFieldMetadataEntityWithoutRelations = (0, _utils.removePropertiesFromRecord)(searchFieldMetadataEntity, (0, _getmetadataentityrelationpropertiesutil.getMetadataEntityRelationProperties)('searchFieldMetadata'));
    const applicationUniversalIdentifier = applicationIdToUniversalIdentifierMap.get(searchFieldMetadataEntity.applicationId);
    if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`Application with id ${searchFieldMetadataEntity.applicationId} not found for searchFieldMetadata ${searchFieldMetadataEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
    }
    const objectMetadataUniversalIdentifier = objectMetadataIdToUniversalIdentifierMap.get(searchFieldMetadataEntity.objectMetadataId);
    if (!(0, _utils.isDefined)(objectMetadataUniversalIdentifier)) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`Object metadata with id ${searchFieldMetadataEntity.objectMetadataId} not found for searchFieldMetadata ${searchFieldMetadataEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
    }
    const fieldMetadataUniversalIdentifier = fieldMetadataIdToUniversalIdentifierMap.get(searchFieldMetadataEntity.fieldMetadataId);
    if (!(0, _utils.isDefined)(fieldMetadataUniversalIdentifier)) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`Field metadata with id ${searchFieldMetadataEntity.fieldMetadataId} not found for searchFieldMetadata ${searchFieldMetadataEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
    }
    const tsVectorFieldMetadataUniversalIdentifier = fieldMetadataIdToUniversalIdentifierMap.get(searchFieldMetadataEntity.tsVectorFieldMetadataId);
    if (!(0, _utils.isDefined)(tsVectorFieldMetadataUniversalIdentifier)) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`TS_VECTOR field metadata with id ${searchFieldMetadataEntity.tsVectorFieldMetadataId} not found for searchFieldMetadata ${searchFieldMetadataEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
    }
    return {
        ...searchFieldMetadataEntityWithoutRelations,
        createdAt: searchFieldMetadataEntity.createdAt.toISOString(),
        updatedAt: searchFieldMetadataEntity.updatedAt.toISOString(),
        universalIdentifier: searchFieldMetadataEntityWithoutRelations.universalIdentifier,
        applicationUniversalIdentifier,
        objectMetadataUniversalIdentifier,
        fieldMetadataUniversalIdentifier,
        tsVectorFieldMetadataUniversalIdentifier
    };
};

//# sourceMappingURL=from-search-field-metadata-entity-to-flat-search-field-metadata.util.js.map