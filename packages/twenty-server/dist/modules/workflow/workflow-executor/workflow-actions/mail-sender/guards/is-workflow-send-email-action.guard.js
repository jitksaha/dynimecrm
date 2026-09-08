"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowSendEmailAction", {
    enumerable: true,
    get: function() {
        return isWorkflowSendEmailAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowSendEmailAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.SEND_EMAIL;
};

//# sourceMappingURL=is-workflow-send-email-action.guard.js.map