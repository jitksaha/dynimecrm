"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowIfElseAction", {
    enumerable: true,
    get: function() {
        return isWorkflowIfElseAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowIfElseAction = (action)=>action.type === _workflow.WorkflowActionType.IF_ELSE;

//# sourceMappingURL=is-workflow-if-else-action.guard.js.map