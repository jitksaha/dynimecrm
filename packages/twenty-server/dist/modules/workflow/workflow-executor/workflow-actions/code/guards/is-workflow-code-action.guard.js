"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowCodeAction", {
    enumerable: true,
    get: function() {
        return isWorkflowCodeAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowCodeAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.CODE;
};

//# sourceMappingURL=is-workflow-code-action.guard.js.map