"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowDelayAction", {
    enumerable: true,
    get: function() {
        return isWorkflowDelayAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowDelayAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.DELAY;
};

//# sourceMappingURL=is-workflow-delay-action.guard.js.map