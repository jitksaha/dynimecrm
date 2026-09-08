"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchVectorGinIndexForCustomObject", {
    enumerable: true,
    get: function() {
        return buildSearchVectorGinIndexForCustomObject;
    }
});
const _types = require("twenty-shared/types");
const _generatedeterministicflatindexutil = require("../../index-metadata/utils/generate-deterministic-flat-index.util");
const buildSearchVectorGinIndexForCustomObject = ({ flatObjectMetadata, searchVectorFlatFieldMetadata })=>{
    const createdAt = new Date().toISOString();
    return (0, _generatedeterministicflatindexutil.generateDeterministicFlatIndexMetadataOrThrow)({
        objectFlatFieldMetadatas: [
            searchVectorFlatFieldMetadata
        ],
        flatIndex: {
            createdAt,
            universalFlatIndexFieldMetadatas: [
                {
                    createdAt,
                    fieldMetadataUniversalIdentifier: searchVectorFlatFieldMetadata.universalIdentifier,
                    order: 0,
                    subFieldName: null,
                    updatedAt: createdAt
                }
            ],
            indexType: _types.IndexType.GIN,
            indexWhereClause: null,
            isCustom: false,
            isUnique: false,
            isSystemSideEffect: true,
            objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            updatedAt: createdAt,
            applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier
        },
        flatObjectMetadata
    });
};

//# sourceMappingURL=build-search-vector-gin-index-for-custom-object.util.js.map