"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "invalidateFieldMetadataCache", {
    enumerable: true,
    get: function() {
        return invalidateFieldMetadataCache;
    }
});
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const invalidateFieldMetadataCache = async ({ workspaceId, workspaceMigrationRunnerService })=>{
    const fieldMetadataRelatedNames = [
        'fieldMetadata',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('fieldMetadata'),
        ...(0, _getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames)('fieldMetadata'),
        'index'
    ];
    await workspaceMigrationRunnerService.invalidateCache({
        allFlatEntityMapsKeys: [
            ...new Set(fieldMetadataRelatedNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ],
        workspaceId
    });
};

//# sourceMappingURL=invalidate-field-metadata-cache.util.js.map