"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildEditLayoutCommandMenuItemUpdate", {
    enumerable: true,
    get: function() {
        return buildEditLayoutCommandMenuItemUpdate;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const LEGACY_EDIT_LAYOUT_AVAILABILITY_EXPRESSION = 'pageType == "RECORD_PAGE" and not isLayoutCustomizationModeEnabled and noneDefined(selectedRecords, "deletedAt") and objectPermissions.canUpdateObjectRecords and objectMetadataItem.nameSingular != "dashboard"';
const buildEditLayoutCommandMenuItemUpdate = ({ existingCommandMenuItem, now })=>{
    if (!(0, _utils.isDefined)(existingCommandMenuItem) || existingCommandMenuItem.availabilityType !== _types.CommandMenuItemAvailabilityType.RECORD_SELECTION || existingCommandMenuItem.conditionalAvailabilityExpression !== LEGACY_EDIT_LAYOUT_AVAILABILITY_EXPRESSION) {
        return undefined;
    }
    const standardCommandMenuItem = _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.editRecordPageLayout;
    return {
        ...existingCommandMenuItem,
        availabilityType: standardCommandMenuItem.availabilityType,
        conditionalAvailabilityExpression: standardCommandMenuItem.conditionalAvailabilityExpression,
        updatedAt: now
    };
};

//# sourceMappingURL=build-edit-layout-command-menu-item-update.util.js.map