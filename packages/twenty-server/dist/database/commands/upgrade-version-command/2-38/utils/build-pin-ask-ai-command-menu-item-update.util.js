"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildPinAskAiCommandMenuItemUpdate", {
    enumerable: true,
    get: function() {
        return buildPinAskAiCommandMenuItemUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const LEGACY_ASK_AI_SHORT_LABEL = 'Ask AI';
const LEGACY_ASK_AI_ICON = 'IconSparkles';
const buildPinAskAiCommandMenuItemUpdate = ({ existingCommandMenuItem, now })=>{
    if (!(0, _utils.isDefined)(existingCommandMenuItem)) {
        return undefined;
    }
    // These properties are workspace-editable, so an override means the
    // workspace already made its own choice for this command.
    const hasWorkspaceOverride = (0, _utils.isDefined)(existingCommandMenuItem.overrides?.isPinned) || (0, _utils.isDefined)(existingCommandMenuItem.overrides?.shortLabel) || (0, _utils.isDefined)(existingCommandMenuItem.overrides?.icon);
    if (hasWorkspaceOverride || existingCommandMenuItem.isPinned !== false || existingCommandMenuItem.shortLabel !== LEGACY_ASK_AI_SHORT_LABEL || existingCommandMenuItem.icon !== LEGACY_ASK_AI_ICON) {
        return undefined;
    }
    return {
        ...existingCommandMenuItem,
        isPinned: _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.isPinned,
        shortLabel: _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.shortLabel,
        icon: _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.askAi.icon,
        updatedAt: now
    };
};

//# sourceMappingURL=build-pin-ask-ai-command-menu-item-update.util.js.map