"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateDeterministicFlatIndexMetadataOrThrow", {
    enumerable: true,
    get: function() {
        return generateDeterministicFlatIndexMetadataOrThrow;
    }
});
const _application = require("twenty-shared/application");
const _computeflatindexnameutil = require("./compute-flat-index-name.util");
const generateDeterministicFlatIndexMetadataOrThrow = ({ flatObjectMetadata, objectFlatFieldMetadatas, flatIndex })=>{
    const name = (0, _computeflatindexnameutil.computeFlatIndexNameOrThrow)({
        flatObjectMetadata,
        objectFlatFieldMetadatas,
        indexFields: flatIndex.universalFlatIndexFieldMetadatas,
        isUnique: flatIndex.isUnique,
        indexWhereClause: flatIndex.indexWhereClause
    });
    const universalIdentifier = (0, _application.getIndexUniversalIdentifier)({
        applicationUniversalIdentifier: flatIndex.applicationUniversalIdentifier,
        objectUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        name
    });
    return {
        ...flatIndex,
        name,
        universalIdentifier,
        universalFlatIndexFieldMetadatas: flatIndex.universalFlatIndexFieldMetadatas.map((universalFlatIndexFieldMetadata)=>({
                ...universalFlatIndexFieldMetadata,
                indexMetadataUniversalIdentifier: universalIdentifier
            }))
    };
};

//# sourceMappingURL=generate-deterministic-flat-index.util.js.map