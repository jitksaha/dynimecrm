"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateDeterministicIndexForFlatFieldMetadataOrThrow", {
    enumerable: true,
    get: function() {
        return generateDeterministicIndexForFlatFieldMetadataOrThrow;
    }
});
const _types = require("twenty-shared/types");
const _generatedeterministicflatindexutil = require("../../index-metadata/utils/generate-deterministic-flat-index.util");
const generateDeterministicIndexForFlatFieldMetadataOrThrow = ({ flatFieldMetadata, flatObjectMetadata })=>{
    const createdAt = new Date().toISOString();
    return (0, _generatedeterministicflatindexutil.generateDeterministicFlatIndexMetadataOrThrow)({
        flatObjectMetadata,
        objectFlatFieldMetadatas: [
            flatFieldMetadata
        ],
        flatIndex: {
            createdAt,
            universalFlatIndexFieldMetadatas: [
                {
                    createdAt,
                    fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
                    order: 0,
                    subFieldName: null,
                    updatedAt: createdAt
                }
            ],
            indexType: _types.IndexType.BTREE,
            indexWhereClause: null,
            isCustom: true,
            isUnique: flatFieldMetadata.isUnique ?? false,
            isSystemSideEffect: true,
            objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            updatedAt: createdAt,
            applicationUniversalIdentifier: flatFieldMetadata.applicationUniversalIdentifier
        }
    });
};

//# sourceMappingURL=generate-deterministic-index-for-flat-field-metadata-or-throw.util.js.map