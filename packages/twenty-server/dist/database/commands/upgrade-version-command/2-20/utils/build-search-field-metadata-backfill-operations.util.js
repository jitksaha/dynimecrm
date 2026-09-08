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
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _buildflatsearchfieldmetadataforfieldutil = require("../../../../../engine/metadata-modules/flat-search-field-metadata/utils/build-flat-search-field-metadata-for-field.util");
const _findtsvectorflatfieldmetadataforobjectutil = require("../../../../../engine/metadata-modules/flat-search-field-metadata/utils/find-ts-vector-flat-field-metadata-for-object.util");
const buildSearchFieldMetadataBackfillOperations = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, flatSearchFieldMetadataMaps, applicationUniversalIdentifierById, twentyStandardApplicationId, workspaceCustomApplicationId })=>{
    const existingSearchFieldMetadataKeys = new Set();
    for (const flatSearchFieldMetadata of Object.values(flatSearchFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        existingSearchFieldMetadataKeys.add(`${flatSearchFieldMetadata.objectMetadataId}:${flatSearchFieldMetadata.fieldMetadataId}`);
    }
    const flatSearchFieldMetadatasToCreate = [];
    for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        if (flatObjectMetadata.applicationId === twentyStandardApplicationId || flatObjectMetadata.applicationId === workspaceCustomApplicationId) {
            continue;
        }
        if (flatObjectMetadata.isSearchable !== true) {
            continue;
        }
        const applicationUniversalIdentifier = applicationUniversalIdentifierById.get(flatObjectMetadata.applicationId);
        if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
            continue;
        }
        const labelIdentifierFieldMetadataUniversalIdentifier = flatObjectMetadata.labelIdentifierFieldMetadataUniversalIdentifier;
        if (!(0, _utils.isDefined)(labelIdentifierFieldMetadataUniversalIdentifier)) {
            continue;
        }
        const derivedIdFieldUniversalIdentifier = (0, _application.getFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            name: 'id'
        });
        if (labelIdentifierFieldMetadataUniversalIdentifier === derivedIdFieldUniversalIdentifier) {
            continue;
        }
        const labelIdentifierFlatFieldMetadata = flatFieldMetadataMaps.byUniversalIdentifier[labelIdentifierFieldMetadataUniversalIdentifier];
        if (!(0, _utils.isDefined)(labelIdentifierFlatFieldMetadata) || !(0, _utils.isSearchableFieldType)(labelIdentifierFlatFieldMetadata.type)) {
            continue;
        }
        if (existingSearchFieldMetadataKeys.has(`${flatObjectMetadata.id}:${labelIdentifierFlatFieldMetadata.id}`)) {
            continue;
        }
        const tsVectorFlatFieldMetadata = (0, _findtsvectorflatfieldmetadataforobjectutil.findTsVectorFlatFieldMetadataForObject)({
            fieldUniversalIdentifiers: flatObjectMetadata.fieldUniversalIdentifiers,
            flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(tsVectorFlatFieldMetadata)) {
            continue;
        }
        flatSearchFieldMetadatasToCreate.push((0, _buildflatsearchfieldmetadataforfieldutil.buildFlatSearchFieldMetadataForField)({
            flatObjectMetadata,
            flatFieldMetadata: labelIdentifierFlatFieldMetadata,
            tsVectorFlatFieldMetadata,
            position: 0
        }));
    }
    return (0, _utils.fromArrayToValuesByKeyRecord)({
        array: flatSearchFieldMetadatasToCreate,
        key: 'applicationUniversalIdentifier'
    });
};

//# sourceMappingURL=build-search-field-metadata-backfill-operations.util.js.map