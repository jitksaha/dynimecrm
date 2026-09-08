"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchFieldMetadataBackfillOperations", {
    enumerable: true,
    get: function() {
        return buildSearchFieldMetadataBackfillOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitiesbyapplicationidutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entities-by-application-id.util");
const _buildflatsearchfieldmetadataforfieldutil = require("../../../../../engine/metadata-modules/flat-search-field-metadata/utils/build-flat-search-field-metadata-for-field.util");
const _findtsvectorflatfieldmetadataforobjectutil = require("../../../../../engine/metadata-modules/flat-search-field-metadata/utils/find-ts-vector-flat-field-metadata-for-object.util");
const _objectmetadataconstants = require("../../../../../engine/metadata-modules/object-metadata/constants/object-metadata.constants");
const buildSearchFieldMetadataBackfillOperations = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, flatSearchFieldMetadataMaps, standardFlatSearchFieldMetadataMaps, customApplicationId })=>{
    const existingSearchFieldMetadataKeys = new Set(Object.values(flatSearchFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).map((searchFieldMetadata)=>`${searchFieldMetadata.objectMetadataId}:${searchFieldMetadata.fieldMetadataId}`));
    const flatSearchFieldMetadatasToCreate = [];
    // Dedupe (object, field) within a run: standard and custom derivations can overlap.
    const candidateSearchFieldMetadataKeys = new Set();
    const pushCandidateIfMissing = ({ objectMetadataUniversalIdentifier, fieldMetadataUniversalIdentifier, position })=>{
        const flatObjectMetadata = flatObjectMetadataMaps.byUniversalIdentifier[objectMetadataUniversalIdentifier];
        const flatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[fieldMetadataUniversalIdentifier];
        // Skip rows whose object/field isn't provisioned in this workspace yet (keeps
        // the backfill idempotent and lets each sync own its own rows).
        if (!(0, _utils.isDefined)(flatObjectMetadata) || !(0, _utils.isDefined)(flatFieldMetadata)) {
            return;
        }
        const searchFieldMetadataKey = `${flatObjectMetadata.id}:${flatFieldMetadata.id}`;
        if (existingSearchFieldMetadataKeys.has(searchFieldMetadataKey) || candidateSearchFieldMetadataKeys.has(searchFieldMetadataKey)) {
            return;
        }
        const tsVectorFlatFieldMetadata = (0, _findtsvectorflatfieldmetadataforobjectutil.findTsVectorFlatFieldMetadataForObject)({
            fieldUniversalIdentifiers: flatObjectMetadata.fieldUniversalIdentifiers,
            flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(tsVectorFlatFieldMetadata)) {
            return;
        }
        const universalFlatSearchFieldMetadata = (0, _buildflatsearchfieldmetadataforfieldutil.buildFlatSearchFieldMetadataForField)({
            flatObjectMetadata,
            flatFieldMetadata,
            tsVectorFlatFieldMetadata,
            position
        });
        // Second dedupe layer, immune to metadata-id churn: rows created by a previous
        // partial run of this command carry the same deterministic universal identifier
        // (unique per workspace). The id-based check above can miss them when earlier
        // upgrade commands recreated objects/fields under new ids.
        if ((0, _utils.isDefined)(flatSearchFieldMetadataMaps.byUniversalIdentifier[universalFlatSearchFieldMetadata.universalIdentifier])) {
            return;
        }
        candidateSearchFieldMetadataKeys.add(searchFieldMetadataKey);
        flatSearchFieldMetadatasToCreate.push(universalFlatSearchFieldMetadata);
    };
    // Standard objects: mirror exactly what provisioning/standard-sync creates.
    for (const standardSearchFieldMetadata of Object.values(standardFlatSearchFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        pushCandidateIfMissing({
            objectMetadataUniversalIdentifier: standardSearchFieldMetadata.objectMetadataUniversalIdentifier,
            fieldMetadataUniversalIdentifier: standardSearchFieldMetadata.fieldMetadataUniversalIdentifier,
            position: standardSearchFieldMetadata.position
        });
    }
    const customApplicationFlatObjectMetadatas = (0, _findflatentitiesbyapplicationidutil.findFlatEntitiesByApplicationId)({
        flatEntityMaps: flatObjectMetadataMaps,
        applicationId: customApplicationId
    });
    // Custom objects index only the field named 'name' (SEARCH_FIELDS_FOR_CUSTOM_OBJECT).
    // Resolve it by exact name, not the label identifier: junction objects (skipNameField)
    // have no name field and must stay unsearchable — their label identifier is the UUID id.
    for (const flatObjectMetadata of customApplicationFlatObjectMetadatas){
        if (!flatObjectMetadata.isSearchable) {
            continue;
        }
        const nameFieldMetadata = flatObjectMetadata.fieldUniversalIdentifiers.map((fieldUniversalIdentifier)=>flatFieldMetadataMaps.byUniversalIdentifier[fieldUniversalIdentifier]).find((flatFieldMetadata)=>(0, _utils.isDefined)(flatFieldMetadata) && flatFieldMetadata.name === _objectmetadataconstants.DEFAULT_LABEL_IDENTIFIER_FIELD_NAME);
        // Aligns with the recompute, which drops non-searchable-type fields.
        if (!(0, _utils.isDefined)(nameFieldMetadata) || !(0, _utils.isSearchableFieldType)(nameFieldMetadata.type)) {
            continue;
        }
        pushCandidateIfMissing({
            objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            fieldMetadataUniversalIdentifier: nameFieldMetadata.universalIdentifier,
            position: 0
        });
    }
    const flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier = (0, _utils.fromArrayToValuesByKeyRecord)({
        array: flatSearchFieldMetadatasToCreate,
        key: 'applicationUniversalIdentifier'
    });
    return {
        flatSearchFieldMetadatasToCreateByApplicationUniversalIdentifier
    };
};

//# sourceMappingURL=build-search-field-metadata-backfill-operations.util.js.map