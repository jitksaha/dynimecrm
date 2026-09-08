"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildFlatSearchFieldMetadataForField", {
    enumerable: true,
    get: function() {
        return buildFlatSearchFieldMetadataForField;
    }
});
const _application = require("twenty-shared/application");
const buildFlatSearchFieldMetadataForField = ({ flatObjectMetadata, flatFieldMetadata, tsVectorFlatFieldMetadata, position })=>{
    const createdAt = new Date().toISOString();
    return {
        universalIdentifier: (0, _application.getSearchFieldUniversalIdentifier)({
            applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
            fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier
        }),
        createdAt,
        updatedAt: createdAt,
        position,
        isSystemSideEffect: true,
        applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
        objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
        tsVectorFieldMetadataUniversalIdentifier: tsVectorFlatFieldMetadata.universalIdentifier
    };
};

//# sourceMappingURL=build-flat-search-field-metadata-for-field.util.js.map