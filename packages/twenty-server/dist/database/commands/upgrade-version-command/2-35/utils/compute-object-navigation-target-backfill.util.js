"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeObjectNavigationTargetBackfill", {
    enumerable: true,
    get: function() {
        return computeObjectNavigationTargetBackfill;
    }
});
const _utils = require("twenty-shared/utils");
const _enginecomponentkeyenum = require("../../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _isobjectmetadatacommandmenuitempayloadutil = require("../../../../../engine/metadata-modules/command-menu-item/utils/is-object-metadata-command-menu-item-payload.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const computeObjectNavigationTargetBackfill = ({ flatCommandMenuItemMaps, flatObjectMetadataMaps, now })=>{
    const backfill = {
        flatCommandMenuItemsToUpdate: [],
        flatCommandMenuItemsToDelete: []
    };
    for (const flatCommandMenuItem of Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined)){
        if (flatCommandMenuItem.engineComponentKey !== _enginecomponentkeyenum.EngineComponentKey.NAVIGATION || (0, _utils.isDefined)(flatCommandMenuItem.navigationTargetObjectMetadataId) || !(0, _isobjectmetadatacommandmenuitempayloadutil.isObjectMetadataCommandMenuItemPayload)(flatCommandMenuItem.payload)) {
            continue;
        }
        const flatObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: flatCommandMenuItem.payload.objectMetadataItemId,
            flatEntityMaps: flatObjectMetadataMaps
        });
        // The object is gone, so the command can only ever be a no-op in the menu.
        // The new foreign key is what stops these accumulating from now on
        if (!(0, _utils.isDefined)(flatObjectMetadata)) {
            backfill.flatCommandMenuItemsToDelete.push(flatCommandMenuItem);
            continue;
        }
        backfill.flatCommandMenuItemsToUpdate.push({
            ...flatCommandMenuItem,
            navigationTargetObjectMetadataId: flatObjectMetadata.id,
            navigationTargetObjectMetadataUniversalIdentifier: flatObjectMetadata.universalIdentifier,
            updatedAt: now
        });
    }
    return backfill;
};

//# sourceMappingURL=compute-object-navigation-target-backfill.util.js.map