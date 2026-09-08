"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatSearchFieldMetadataToSearchFieldMetadataDto", {
    enumerable: true,
    get: function() {
        return fromFlatSearchFieldMetadataToSearchFieldMetadataDto;
    }
});
const fromFlatSearchFieldMetadataToSearchFieldMetadataDto = (flatSearchFieldMetadata)=>({
        id: flatSearchFieldMetadata.id,
        objectMetadataId: flatSearchFieldMetadata.objectMetadataId,
        fieldMetadataId: flatSearchFieldMetadata.fieldMetadataId,
        tsVectorFieldMetadataId: flatSearchFieldMetadata.tsVectorFieldMetadataId,
        position: flatSearchFieldMetadata.position,
        createdAt: new Date(flatSearchFieldMetadata.createdAt),
        updatedAt: new Date(flatSearchFieldMetadata.updatedAt),
        workspaceId: flatSearchFieldMetadata.workspaceId
    });

//# sourceMappingURL=from-flat-search-field-metadata-to-search-field-metadata-dto.util.js.map