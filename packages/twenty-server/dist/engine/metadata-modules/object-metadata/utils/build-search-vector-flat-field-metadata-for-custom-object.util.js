"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildSearchVectorFlatFieldMetadataForCustomObject", {
    enumerable: true,
    get: function() {
        return buildSearchVectorFlatFieldMetadataForCustomObject;
    }
});
const _application = require("twenty-shared/application");
const _partialsystemflatfieldmetadatasconstant = require("../constants/partial-system-flat-field-metadatas.constant");
const buildSearchVectorFlatFieldMetadataForCustomObject = ({ flatObjectMetadata: { applicationUniversalIdentifier, universalIdentifier: objectMetadataUniversalIdentifier } })=>{
    const now = new Date().toISOString();
    const { searchVector } = _partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS;
    return {
        ...searchVector,
        universalIdentifier: (0, _application.getFieldUniversalIdentifier)({
            applicationUniversalIdentifier,
            objectUniversalIdentifier: objectMetadataUniversalIdentifier,
            name: searchVector.name
        }),
        applicationUniversalIdentifier,
        objectMetadataUniversalIdentifier,
        createdAt: now,
        updatedAt: now,
        universalSettings: null
    };
};

//# sourceMappingURL=build-search-vector-flat-field-metadata-for-custom-object.util.js.map