"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION () {
        return CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION;
    },
    get LEGACY_CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION () {
        return LEGACY_CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION;
    },
    get buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations () {
        return buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _buildlegacynavigationflatcommandmenuitemutil = require("../../utils/build-legacy-navigation-flat-command-menu-item.util");
const LEGACY_CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION = 'featureFlags.IS_CALL_RECORDING_ENABLED and targetObjectReadPermissions.callRecording';
const CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION = 'targetObjectReadPermissions.callRecording';
const CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER = _metadata.STANDARD_OBJECTS.callRecording.universalIdentifier;
const CALL_RECORDING_NAVIGATION_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER = (0, _buildlegacynavigationflatcommandmenuitemutil.getLegacyNavigationCommandUniversalIdentifier)(CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER);
const buildCallRecordingNavigationCommandMenuItemAvailabilityExpressionSyncOperations = ({ existingFlatCommandMenuItemMaps, existingFlatObjectMetadataMaps, now })=>{
    const existingCallRecordingObjectMetadata = existingFlatObjectMetadataMaps.byUniversalIdentifier[CALL_RECORDING_OBJECT_UNIVERSAL_IDENTIFIER];
    const existingCallRecordingNavigationCommandMenuItem = existingFlatCommandMenuItemMaps.byUniversalIdentifier[CALL_RECORDING_NAVIGATION_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER];
    if (!(0, _utils.isDefined)(existingCallRecordingObjectMetadata) || !(0, _utils.isDefined)(existingCallRecordingNavigationCommandMenuItem) || existingCallRecordingNavigationCommandMenuItem.conditionalAvailabilityExpression !== LEGACY_CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION) {
        return {
            flatEntityToCreate: [],
            flatEntityToDelete: [],
            flatEntityToUpdate: []
        };
    }
    return {
        flatEntityToCreate: [],
        flatEntityToDelete: [],
        flatEntityToUpdate: [
            {
                ...existingCallRecordingNavigationCommandMenuItem,
                conditionalAvailabilityExpression: CALL_RECORDING_NAVIGATION_AVAILABILITY_EXPRESSION,
                updatedAt: now
            }
        ]
    };
};

//# sourceMappingURL=build-call-recording-navigation-command-menu-item-availability-expression-sync-operations.util.js.map