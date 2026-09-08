"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMessageListStandardFlatIndexMetadatas", {
    enumerable: true,
    get: function() {
        return buildMessageListStandardFlatIndexMetadatas;
    }
});
const _types = require("twenty-shared/types");
const _createstandardindexflatmetadatautil = require("./create-standard-index-flat-metadata.util");
const buildMessageListStandardFlatIndexMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
        searchVectorGinIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                indexName: 'searchVectorGinIndex',
                relatedFieldNames: [
                    'searchVector'
                ],
                indexType: _types.IndexType.GIN,
                hasDeterministicUniversalIdentifier: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        })
    });

//# sourceMappingURL=compute-message-list-standard-flat-index-metadata.util.js.map