"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchFieldMetadatasByTsVectorFieldId", {
    enumerable: true,
    get: function() {
        return buildSearchFieldMetadatasByTsVectorFieldId;
    }
});
const _utils = require("twenty-shared/utils");
const buildSearchFieldMetadatasByTsVectorFieldId = (flatSearchFieldMetadataMaps)=>{
    const searchFieldMetadatasByTsVectorFieldId = new Map();
    for (const flatSearchFieldMetadata of Object.values(flatSearchFieldMetadataMaps.byUniversalIdentifier)){
        if (!(0, _utils.isDefined)(flatSearchFieldMetadata)) {
            continue;
        }
        const { tsVectorFieldMetadataId } = flatSearchFieldMetadata;
        const existingSearchFieldMetadatas = searchFieldMetadatasByTsVectorFieldId.get(tsVectorFieldMetadataId) ?? [];
        existingSearchFieldMetadatas.push(flatSearchFieldMetadata);
        searchFieldMetadatasByTsVectorFieldId.set(tsVectorFieldMetadataId, existingSearchFieldMetadatas);
    }
    return searchFieldMetadatasByTsVectorFieldId;
};

//# sourceMappingURL=build-search-field-metadatas-by-ts-vector-field-id.util.js.map