"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSearchVectorGinFlatIndexMetadata", {
    enumerable: true,
    get: function() {
        return isSearchVectorGinFlatIndexMetadata;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _searchvectorfieldconstants = require("../../../../../engine/metadata-modules/search-field-metadata/constants/search-vector-field.constants");
const isSearchVectorGinFlatIndexMetadata = ({ flatIndexMetadata, flatFieldMetadataMaps })=>{
    if (flatIndexMetadata.indexType !== _types.IndexType.GIN) {
        return false;
    }
    if (flatIndexMetadata.flatIndexFieldMetadatas.length !== 1) {
        return false;
    }
    const indexedFlatFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityMaps: flatFieldMetadataMaps,
        flatEntityId: flatIndexMetadata.flatIndexFieldMetadatas[0].fieldMetadataId
    });
    return (0, _utils.isDefined)(indexedFlatFieldMetadata) && indexedFlatFieldMetadata.type === _types.FieldMetadataType.TS_VECTOR && indexedFlatFieldMetadata.name === _searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name;
};

//# sourceMappingURL=is-search-vector-gin-flat-index-metadata.util.js.map