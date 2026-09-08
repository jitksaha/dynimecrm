"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowIteratorAction", {
    enumerable: true,
    get: function() {
        return isWorkflowIteratorAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowIteratorAction = (action)=>action.type === _workflow.WorkflowActionType.ITERATOR;

//# sourceMappingURL=is-workflow-iterator-action.guard.js.map