"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildHideAskAiInSidePanelCommandMenuItemUpdate", {
    enumerable: true,
    get: function() {
        return buildHideAskAiInSidePanelCommandMenuItemUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const LEGACY_ASK_AI_AVAILABILITY_EXPRESSION = 'permissionFlags.AI';
const buildHideAskAiInSidePanelCommandMenuItemUpdate = ({ existingCommandMenuItem, now })=>{
    if (!(0, _utils.isDefined)(existingCommandMenuItem) || existingCommandMenuItem.conditionalAvailabilityExpression !== LEGACY_ASK_AI_AVAILABILITY_EXPRESSION) {
        return undefined;
    }
    return {
        ...existingCommandMenuItem,
        conditionalAvailabilityExpression: _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.conditionalAvailabilityExpression,
        updatedAt: now
    };
};

//# sourceMappingURL=build-hide-ask-ai-in-side-panel-command-menu-item-update.util.js.map