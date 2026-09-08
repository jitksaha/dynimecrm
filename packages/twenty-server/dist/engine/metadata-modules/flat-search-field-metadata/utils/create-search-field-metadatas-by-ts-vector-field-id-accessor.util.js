"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createSearchFieldMetadatasByTsVectorFieldIdAccessor", {
    enumerable: true,
    get: function() {
        return createSearchFieldMetadatasByTsVectorFieldIdAccessor;
    }
});
const _buildsearchfieldmetadatasbytsvectorfieldidutil = require("./build-search-field-metadatas-by-ts-vector-field-id.util");
const createSearchFieldMetadatasByTsVectorFieldIdAccessor = (getFlatSearchFieldMetadataMaps)=>{
    let searchFieldMetadatasByTsVectorFieldId;
    return {
        get: (tsVectorFieldMetadataId)=>{
            searchFieldMetadatasByTsVectorFieldId ??= (0, _buildsearchfieldmetadatasbytsvectorfieldidutil.buildSearchFieldMetadatasByTsVectorFieldId)(getFlatSearchFieldMetadataMaps());
            return searchFieldMetadatasByTsVectorFieldId.get(tsVectorFieldMetadataId) ?? [];
        },
        invalidate: ()=>{
            searchFieldMetadatasByTsVectorFieldId = undefined;
        }
    };
};

//# sourceMappingURL=create-search-field-metadatas-by-ts-vector-field-id-accessor.util.js.map