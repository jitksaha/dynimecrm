"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowHttpRequestAction", {
    enumerable: true,
    get: function() {
        return isWorkflowHttpRequestAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowHttpRequestAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.HTTP_REQUEST;
};

//# sourceMappingURL=is-workflow-http-request-action.guard.js.map