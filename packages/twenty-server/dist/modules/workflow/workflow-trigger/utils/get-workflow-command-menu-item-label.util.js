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
    get DEFAULT_WORKFLOW_COMMAND_MENU_ITEM_LABEL () {
        return DEFAULT_WORKFLOW_COMMAND_MENU_ITEM_LABEL;
    },
    get getWorkflowCommandMenuItemLabel () {
        return getWorkflowCommandMenuItemLabel;
    }
});
const _guards = require("@sniptt/guards");
const DEFAULT_WORKFLOW_COMMAND_MENU_ITEM_LABEL = 'Untitled Workflow';
const getWorkflowCommandMenuItemLabel = (workflow)=>(0, _guards.isNonEmptyString)(workflow.name) ? workflow.name : DEFAULT_WORKFLOW_COMMAND_MENU_ITEM_LABEL;

//# sourceMappingURL=get-workflow-command-menu-item-label.util.js.map