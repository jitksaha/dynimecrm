"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowFormAction", {
    enumerable: true,
    get: function() {
        return isWorkflowFormAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowFormAction = (action)=>action.type === _workflow.WorkflowActionType.FORM;

//# sourceMappingURL=is-workflow-form-action.guard.js.map