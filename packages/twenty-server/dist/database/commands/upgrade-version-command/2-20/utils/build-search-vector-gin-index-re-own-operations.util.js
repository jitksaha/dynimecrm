"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchVectorGinIndexReOwnOperations", {
    enumerable: true,
    get: function() {
        return buildSearchVectorGinIndexReOwnOperations;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _issearchvectorginflatindexmetadatautil = require("./is-search-vector-gin-flat-index-metadata.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const buildSearchVectorGinIndexReOwnOperations = ({ flatObjectMetadataMaps, flatFieldMetadataMaps, flatIndexMaps, applicationUniversalIdentifierById })=>{
    const indexUniversalIdentifierUpdates = [];
    for (const flatIndexMetadata of Object.values(flatIndexMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        if (!(0, _issearchvectorginflatindexmetadatautil.isSearchVectorGinFlatIndexMetadata)({
            flatIndexMetadata,
            flatFieldMetadataMaps
        })) {
            continue;
        }
        const applicationUniversalIdentifier = applicationUniversalIdentifierById.get(flatIndexMetadata.applicationId);
        const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatObjectMetadataMaps,
            flatEntityId: flatIndexMetadata.objectMetadataId
        });
        if (!(0, _utils.isDefined)(applicationUniversalIdentifier) || !(0, _utils.isDefined)(flatObjectMetadata)) {
            continue;
        }
        const deterministicUniversalIdentifier = (0, _application.getIndexUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            name: flatIndexMetadata.name
        });
        if (deterministicUniversalIdentifier === flatIndexMetadata.universalIdentifier) {
            continue;
        }
        indexUniversalIdentifierUpdates.push({
            id: flatIndexMetadata.id,
            name: flatIndexMetadata.name,
            deterministicUniversalIdentifier
        });
    }
    return indexUniversalIdentifierUpdates;
};

//# sourceMappingURL=build-search-vector-gin-index-re-own-operations.util.js.map