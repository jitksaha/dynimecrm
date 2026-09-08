"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSearchFieldMetadataToCreateOnLabelIdentifierUpdate", {
    enumerable: true,
    get: function() {
        return computeSearchFieldMetadataToCreateOnLabelIdentifierUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findmanyflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-many-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _buildflatsearchfieldmetadataforfieldutil = require("../../flat-search-field-metadata/utils/build-flat-search-field-metadata-for-field.util");
const _findtsvectorflatfieldmetadataforobjectutil = require("../../flat-search-field-metadata/utils/find-ts-vector-flat-field-metadata-for-object.util");
const EMPTY_SIDE_EFFECT = {
    searchFieldMetadatasToCreate: []
};
const computeSearchFieldMetadataToCreateOnLabelIdentifierUpdate = ({ fromFlatObjectMetadata, toFlatObjectMetadata, flatFieldMetadataMaps, flatSearchFieldMetadataMaps })=>{
    const newLabelIdentifierFieldMetadataId = toFlatObjectMetadata.labelIdentifierFieldMetadataId;
    if (!toFlatObjectMetadata.isSearchable || !(0, _utils.isDefined)(newLabelIdentifierFieldMetadataId) || fromFlatObjectMetadata.labelIdentifierFieldMetadataId === newLabelIdentifierFieldMetadataId) {
        return EMPTY_SIDE_EFFECT;
    }
    const existingSearchFieldMetadatas = (0, _findmanyflatentitybyidinflatentitymapsorthrowutil.findManyFlatEntityByIdInFlatEntityMapsOrThrow)({
        flatEntityMaps: flatSearchFieldMetadataMaps,
        flatEntityIds: fromFlatObjectMetadata.searchFieldMetadataIds
    });
    const newLabelIdentifierAlreadyIndexed = existingSearchFieldMetadatas.some((searchFieldMetadata)=>searchFieldMetadata.fieldMetadataId === newLabelIdentifierFieldMetadataId);
    const newLabelIdentifierField = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityMaps: flatFieldMetadataMaps,
        flatEntityId: newLabelIdentifierFieldMetadataId
    });
    const shouldIndexNewLabelIdentifier = (0, _utils.isDefined)(newLabelIdentifierField) && (0, _utils.isSearchableFieldType)(newLabelIdentifierField.type) && !newLabelIdentifierAlreadyIndexed;
    if (!shouldIndexNewLabelIdentifier) {
        return EMPTY_SIDE_EFFECT;
    }
    const tsVectorFlatFieldMetadata = (0, _findtsvectorflatfieldmetadataforobjectutil.findTsVectorFlatFieldMetadataForObject)({
        fieldUniversalIdentifiers: fromFlatObjectMetadata.fieldUniversalIdentifiers,
        flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(tsVectorFlatFieldMetadata)) {
        return EMPTY_SIDE_EFFECT;
    }
    const newLabelIdentifierPosition = existingSearchFieldMetadatas.reduce((maxPosition, searchFieldMetadata)=>Math.max(maxPosition, searchFieldMetadata.position), -1) + 1;
    const newSearchFieldMetadata = (0, _buildflatsearchfieldmetadataforfieldutil.buildFlatSearchFieldMetadataForField)({
        flatObjectMetadata: fromFlatObjectMetadata,
        flatFieldMetadata: newLabelIdentifierField,
        tsVectorFlatFieldMetadata,
        position: newLabelIdentifierPosition
    });
    return {
        searchFieldMetadatasToCreate: [
            newSearchFieldMetadata
        ]
    };
};

//# sourceMappingURL=compute-search-field-metadata-to-create-on-label-identifier-update.util.js.map