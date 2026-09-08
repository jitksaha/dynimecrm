"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchVectorGinIndexBackfillOperations", {
    enumerable: true,
    get: function() {
        return buildSearchVectorGinIndexBackfillOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _issearchvectorginflatindexmetadatautil = require("./is-search-vector-gin-flat-index-metadata.util");
const _findtsvectorflatfieldmetadataforobjectutil = require("../../../../../engine/metadata-modules/flat-search-field-metadata/utils/find-ts-vector-flat-field-metadata-for-object.util");
const _buildsearchvectorginindexforcustomobjectutil = require("../../../../../engine/metadata-modules/object-metadata/utils/build-search-vector-gin-index-for-custom-object.util");
const buildSearchVectorGinIndexBackfillOperations = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, twentyStandardApplicationId, workspaceCustomApplicationId })=>{
    const objectMetadataIdsWithSearchVectorGinIndex = new Set();
    for (const flatIndexMetadata of Object.values(flatIndexMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        if ((0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })) {
            objectMetadataIdsWithSearchVectorGinIndex.add(flatIndexMetadata.objectMetadataId);
        }
    }
    const flatIndexesToCreate = [];
    for (const flatObjectMetadata of Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        if (flatObjectMetadata.applicationId === twentyStandardApplicationId || flatObjectMetadata.applicationId === workspaceCustomApplicationId) {
            continue;
        }
        if (objectMetadataIdsWithSearchVectorGinIndex.has(flatObjectMetadata.id)) {
            continue;
        }
        const tsVectorFlatFieldMetadata = (0, _findtsvectorflatfieldmetadataforobjectutil.findTsVectorFlatFieldMetadataForObject)({
            fieldUniversalIdentifiers: flatObjectMetadata.fieldUniversalIdentifiers,
            flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(tsVectorFlatFieldMetadata)) {
            continue;
        }
        flatIndexesToCreate.push((0, _buildsearchvectorginindexforcustomobjectutil.buildSearchVectorGinIndexForCustomObject)({
            flatObjectMetadata,
            searchVectorFlatFieldMetadata: tsVectorFlatFieldMetadata
        }));
    }
    return (0, _utils.fromArrayToValuesByKeyRecord)({
        array: flatIndexesToCreate,
        key: 'applicationUniversalIdentifier'
    });
};

//# sourceMappingURL=build-search-vector-gin-index-backfill-operations.util.js.map