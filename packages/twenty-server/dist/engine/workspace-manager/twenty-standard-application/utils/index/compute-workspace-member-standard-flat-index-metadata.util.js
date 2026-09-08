"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildWorkspaceMemberStandardFlatIndexMetadatas", {
    enumerable: true,
    get: function() {
        return buildWorkspaceMemberStandardFlatIndexMetadatas;
    }
});
const _types = require("twenty-shared/types");
const _createstandardindexflatmetadatautil = require("./create-standard-index-flat-metadata.util");
const buildWorkspaceMemberStandardFlatIndexMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
        userEmailUniqueIndex: (0, _createstandardindexflatmetadatautil.createStandardIndexFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                indexName: 'userEmailUniqueIndex',
                relatedFieldNames: [
                    'userEmail'
                ],
                isUnique: true,
                hasDeterministicUniversalIdentifier: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
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

//# sourceMappingURL=compute-workspace-member-standard-flat-index-metadata.util.js.map