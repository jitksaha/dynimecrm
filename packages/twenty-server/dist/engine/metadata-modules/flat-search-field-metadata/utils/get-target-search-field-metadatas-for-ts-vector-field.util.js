"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getTargetSearchFieldMetadatasForTsVectorField", {
    enumerable: true,
    get: function() {
        return getTargetSearchFieldMetadatasForTsVectorField;
    }
});
const _utils = require("twenty-shared/utils");
const getTargetSearchFieldMetadatasForTsVectorField = ({ tsVectorFieldMetadataId, flatSearchFieldMetadataMaps })=>Object.values(flatSearchFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatSearchFieldMetadata)=>flatSearchFieldMetadata.tsVectorFieldMetadataId === tsVectorFieldMetadataId);

//# sourceMappingURL=get-target-search-field-metadatas-for-ts-vector-field.util.js.map