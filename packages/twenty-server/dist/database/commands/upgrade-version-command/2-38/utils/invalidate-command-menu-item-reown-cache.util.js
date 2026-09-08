"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "invalidateCommandMenuItemReownCache", {
    enumerable: true,
    get: function() {
        return invalidateCommandMenuItemReownCache;
    }
});
const _getmetadataflatentitymapskeyutil = require("../../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const invalidateCommandMenuItemReownCache = async ({ workspaceId, workspaceMigrationRunnerService })=>{
    const reownedMetadataRelatedNames = [
        'commandMenuItem',
        ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('commandMenuItem')
    ];
    await workspaceMigrationRunnerService.invalidateCache({
        allFlatEntityMapsKeys: [
            ...new Set(reownedMetadataRelatedNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ],
        workspaceId
    });
};

//# sourceMappingURL=invalidate-command-menu-item-reown-cache.util.js.map