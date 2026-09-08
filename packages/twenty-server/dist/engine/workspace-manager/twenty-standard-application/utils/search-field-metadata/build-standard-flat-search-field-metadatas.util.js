"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardFlatSearchFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildStandardFlatSearchFieldMetadatas;
    }
});
const _createstandardsearchfieldflatmetadatautil = require("./create-standard-search-field-flat-metadata.util");
const buildStandardFlatSearchFieldMetadatas = ({ now, objectName, workspaceId, searchFields, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>searchFields.map((searchField, position)=>(0, _createstandardsearchfieldflatmetadatautil.createStandardSearchFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: searchField.name,
                position
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }));

//# sourceMappingURL=build-standard-flat-search-field-metadatas.util.js.map