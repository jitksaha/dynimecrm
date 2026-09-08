"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "invalidateIndexViewReconcileCache", {
    enumerable: true,
    get: function() {
        return invalidateIndexViewReconcileCache;
    }
});
const _getmetadataflatentitymapskeyutil = require("../../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const invalidateIndexViewReconcileCache = async ({ workspaceId, workspaceMigrationRunnerService })=>{
    const reconciledMetadataRelatedNames = [
        'view',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('view'),
        'viewField',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('viewField'),
        'pageLayoutWidget'
    ];
    await workspaceMigrationRunnerService.invalidateCache({
        allFlatEntityMapsKeys: [
            ...new Set(reconciledMetadataRelatedNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ],
        workspaceId
    });
};

//# sourceMappingURL=invalidate-index-view-reconcile-cache.util.js.map