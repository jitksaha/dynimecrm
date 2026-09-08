"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchFieldMetadataReOwnOperations", {
    enumerable: true,
    get: function() {
        return buildSearchFieldMetadataReOwnOperations;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const buildSearchFieldMetadataReOwnOperations = ({ flatFieldMetadataMaps, flatSearchFieldMetadataMaps, applicationUniversalIdentifierById })=>{
    const searchFieldMetadataUniversalIdentifierUpdates = [];
    for (const flatSearchFieldMetadata of Object.values(flatSearchFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        const applicationUniversalIdentifier = applicationUniversalIdentifierById.get(flatSearchFieldMetadata.applicationId);
        const indexedFlatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityMaps: flatFieldMetadataMaps,
            flatEntityId: flatSearchFieldMetadata.fieldMetadataId
        });
        if (!(0, _utils.isDefined)(applicationUniversalIdentifier) || !(0, _utils.isDefined)(indexedFlatFieldMetadata)) {
            continue;
        }
        const deterministicUniversalIdentifier = (0, _application.getSearchFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            fieldMetadataUniversalIdentifier: indexedFlatFieldMetadata.universalIdentifier
        });
        if (deterministicUniversalIdentifier === flatSearchFieldMetadata.universalIdentifier) {
            continue;
        }
        searchFieldMetadataUniversalIdentifierUpdates.push({
            id: flatSearchFieldMetadata.id,
            deterministicUniversalIdentifier
        });
    }
    return searchFieldMetadataUniversalIdentifierUpdates;
};

//# sourceMappingURL=build-search-field-metadata-re-own-operations.util.js.map