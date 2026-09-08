"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "METADATA_GRAPHQL_OPERATIONS_TO_CACHE", {
    enumerable: true,
    get: function() {
        return METADATA_GRAPHQL_OPERATIONS_TO_CACHE;
    }
});
const _findallviewsgraphqloperationconstant = require("../../../../metadata-modules/view/constants/find-all-views-graphql-operation.constant");
const METADATA_GRAPHQL_OPERATIONS_TO_CACHE = {
    ObjectMetadataItems: {
        scope: 'workspace',
        dependencies: [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatIndexMaps',
            'flatSearchFieldMetadataMaps',
            'flatApplicationMaps'
        ]
    },
    [_findallviewsgraphqloperationconstant.FIND_ALL_VIEWS_GRAPHQL_OPERATION]: {
        scope: 'userWorkspace',
        dependencies: [
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps',
            'flatViewFilterMaps',
            'flatViewFilterGroupMaps',
            'flatViewSortMaps',
            'flatViewGroupMaps',
            'flatObjectMetadataMaps',
            'flatApplicationMaps'
        ]
    }
};

//# sourceMappingURL=metadata-graphql-operations-to-cache.constant.js.map