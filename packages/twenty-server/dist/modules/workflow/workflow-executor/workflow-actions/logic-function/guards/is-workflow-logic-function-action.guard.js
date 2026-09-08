"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowLogicFunctionAction", {
    enumerable: true,
    get: function() {
        return isWorkflowLogicFunctionAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowLogicFunctionAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.LOGIC_FUNCTION;
};

//# sourceMappingURL=is-workflow-logic-function-action.guard.js.map