"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowFilterAction", {
    enumerable: true,
    get: function() {
        return isWorkflowFilterAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowFilterAction = (action)=>action.type === _workflow.WorkflowActionType.FILTER;

//# sourceMappingURL=is-workflow-filter-action.guard.js.map