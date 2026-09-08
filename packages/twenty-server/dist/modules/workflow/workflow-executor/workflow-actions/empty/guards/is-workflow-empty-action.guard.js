"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowEmptyAction", {
    enumerable: true,
    get: function() {
        return isWorkflowEmptyAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowEmptyAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.EMPTY;
};

//# sourceMappingURL=is-workflow-empty-action.guard.js.map