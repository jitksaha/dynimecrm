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
    get LEGACY_DISCARD_DRAFT_WORKFLOW_AVAILABILITY_EXPRESSION () {
        return LEGACY_DISCARD_DRAFT_WORKFLOW_AVAILABILITY_EXPRESSION;
    },
    get buildDiscardDraftWorkflowCommandMenuItemsToUpdate () {
        return buildDiscardDraftWorkflowCommandMenuItemsToUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const _standardcommandmenuitemconstant = require("../../../../../engine/workspace-manager/twenty-standard-application/constants/standard-command-menu-item.constant");
const LEGACY_DISCARD_DRAFT_WORKFLOW_AVAILABILITY_EXPRESSION = 'every(selectedRecords, "versions.length") and everyEquals(selectedRecords, "currentVersion.status", "DRAFT") and noneDefined(selectedRecords, "deletedAt")';
const DISCARD_DRAFT_WORKFLOW_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER = _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.discardDraftWorkflow.universalIdentifier;
const DISCARD_DRAFT_WORKFLOW_AVAILABILITY_EXPRESSION = _standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS.discardDraftWorkflow.conditionalAvailabilityExpression;
const buildDiscardDraftWorkflowCommandMenuItemsToUpdate = ({ existingFlatCommandMenuItemMaps })=>{
    const existingDiscardDraftWorkflowCommandMenuItem = existingFlatCommandMenuItemMaps.byUniversalIdentifier[DISCARD_DRAFT_WORKFLOW_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER];
    if (!(0, _utils.isDefined)(existingDiscardDraftWorkflowCommandMenuItem) || existingDiscardDraftWorkflowCommandMenuItem.conditionalAvailabilityExpression !== LEGACY_DISCARD_DRAFT_WORKFLOW_AVAILABILITY_EXPRESSION) {
        return [];
    }
    return [
        {
            ...existingDiscardDraftWorkflowCommandMenuItem,
            conditionalAvailabilityExpression: DISCARD_DRAFT_WORKFLOW_AVAILABILITY_EXPRESSION
        }
    ];
};

//# sourceMappingURL=build-sync-discard-draft-workflow-availability-expression-sync-operations.util.js.map