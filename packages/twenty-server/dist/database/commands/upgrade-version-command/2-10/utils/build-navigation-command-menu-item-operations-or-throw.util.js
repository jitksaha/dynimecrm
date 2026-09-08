"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildNavigationCommandMenuItemOperationsOrThrow", {
    enumerable: true,
    get: function() {
        return buildNavigationCommandMenuItemOperationsOrThrow;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _buildlegacynavigationflatcommandmenuitemutil = require("../../utils/build-legacy-navigation-flat-command-menu-item.util");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../../engine/metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const buildNavigationCommandMenuItemOperationsOrThrow = ({ existingFlatCommandMenuItemMaps, objectMetadatasForNavigation, applicationId, workspaceId, now, renamedCollisionObjectMetadatas })=>{
    const flatEntityToCreate = [];
    const flatEntityToUpdate = [];
    let nextPosition = Object.values(existingFlatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).reduce((maxPosition, commandMenuItem)=>Math.max(maxPosition, commandMenuItem.position), -1) + 1;
    for (const objectMetadata of objectMetadatasForNavigation){
        const commandMenuItemUniversalIdentifier = (0, _buildlegacynavigationflatcommandmenuitemutil.getLegacyNavigationCommandUniversalIdentifier)(objectMetadata.universalIdentifier);
        if (!objectMetadata.isActive || (0, _utils.isDefined)(existingFlatCommandMenuItemMaps.byUniversalIdentifier[commandMenuItemUniversalIdentifier])) {
            continue;
        }
        flatEntityToCreate.push((0, _buildlegacynavigationflatcommandmenuitemutil.buildLegacyNavigationFlatCommandMenuItem)({
            objectMetadata,
            commandMenuItemId: (0, _uuid.v4)(),
            applicationId,
            applicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            workspaceId,
            position: nextPosition++,
            now
        }));
    }
    for (const renamedCollisionObjectMetadata of renamedCollisionObjectMetadatas){
        const renamedNavigationCommandMenuItemUniversalIdentifier = (0, _buildlegacynavigationflatcommandmenuitemutil.getLegacyNavigationCommandUniversalIdentifier)(renamedCollisionObjectMetadata.universalIdentifier);
        const staleNavigationCommandMenuItem = existingFlatCommandMenuItemMaps.byUniversalIdentifier[renamedNavigationCommandMenuItemUniversalIdentifier];
        if ((0, _utils.isDefined)(staleNavigationCommandMenuItem)) {
            flatEntityToUpdate.push({
                ...staleNavigationCommandMenuItem,
                conditionalAvailabilityExpression: (0, _buildobjectnavigationuniversalflatcommandmenuitemutil.buildNavigationConditionalAvailabilityExpression)({
                    universalIdentifier: renamedCollisionObjectMetadata.universalIdentifier,
                    nameSingular: renamedCollisionObjectMetadata.nameSingular
                }),
                updatedAt: now
            });
        }
    }
    return {
        flatEntityToCreate,
        flatEntityToDelete: [],
        flatEntityToUpdate
    };
};

//# sourceMappingURL=build-navigation-command-menu-item-operations-or-throw.util.js.map