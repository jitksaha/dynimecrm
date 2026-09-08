"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateFlatIndexMetadataWithNameOrThrow", {
    enumerable: true,
    get: function() {
        return generateFlatIndexMetadataWithNameOrThrow;
    }
});
const _computeflatindexnameutil = require("./compute-flat-index-name.util");
const generateFlatIndexMetadataWithNameOrThrow = ({ flatObjectMetadata, objectFlatFieldMetadatas, flatIndex })=>{
    const name = (0, _computeflatindexnameutil.computeFlatIndexNameOrThrow)({
        flatObjectMetadata,
        objectFlatFieldMetadatas,
        indexFields: flatIndex.universalFlatIndexFieldMetadatas,
        isUnique: flatIndex.isUnique,
        indexWhereClause: flatIndex.indexWhereClause
    });
    return {
        ...flatIndex,
        name
    };
};

//# sourceMappingURL=generate-flat-index.util.js.map