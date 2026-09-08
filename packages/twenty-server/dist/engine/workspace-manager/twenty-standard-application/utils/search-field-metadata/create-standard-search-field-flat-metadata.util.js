"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createStandardSearchFieldFlatMetadata", {
    enumerable: true,
    get: function() {
        return createStandardSearchFieldFlatMetadata;
    }
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const _uuid = require("uuid");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _searchvectorfieldconstants = require("../../../../metadata-modules/search-field-metadata/constants/search-vector-field.constants");
const createStandardSearchFieldFlatMetadata = ({ workspaceId, objectName, context: { fieldName, position }, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps: { flatFieldMetadataMaps, flatObjectMetadataMaps }, twentyStandardApplicationId, now })=>{
    const objectFields = _metadata.STANDARD_OBJECTS[objectName].fields;
    const objectMetadataId = standardObjectMetadataRelatedEntityIds[objectName].id;
    const fieldMetadataId = standardObjectMetadataRelatedEntityIds[objectName].fields[fieldName].id;
    const objectMetadataUniversalIdentifier = _metadata.STANDARD_OBJECTS[objectName].universalIdentifier;
    const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
        universalIdentifier: objectMetadataUniversalIdentifier,
        flatEntityMaps: flatObjectMetadataMaps
    });
    const fieldMetadataUniversalIdentifier = objectFields[fieldName].universalIdentifier;
    const flatFieldMetadata = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
        universalIdentifier: fieldMetadataUniversalIdentifier,
        flatEntityMaps: flatFieldMetadataMaps
    });
    const tsVectorFieldMetadataId = standardObjectMetadataRelatedEntityIds[objectName].fields[_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name].id;
    const tsVectorFieldMetadataUniversalIdentifier = objectFields[_searchvectorfieldconstants.SEARCH_VECTOR_FIELD.name].universalIdentifier;
    return {
        id: (0, _uuid.v4)(),
        universalIdentifier: (0, _application.getSearchFieldUniversalIdentifier)({
            applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
            fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier
        }),
        applicationId: twentyStandardApplicationId,
        applicationUniversalIdentifier: flatObjectMetadata.applicationUniversalIdentifier,
        objectMetadataId,
        objectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
        fieldMetadataId,
        fieldMetadataUniversalIdentifier: flatFieldMetadata.universalIdentifier,
        tsVectorFieldMetadataId,
        tsVectorFieldMetadataUniversalIdentifier,
        position,
        isSystemSideEffect: true,
        workspaceId,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=create-standard-search-field-flat-metadata.util.js.map