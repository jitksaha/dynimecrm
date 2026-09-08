"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowDeleteRecordAction", {
    enumerable: true,
    get: function() {
        return isWorkflowDeleteRecordAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowDeleteRecordAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.DELETE_RECORD;
};

//# sourceMappingURL=is-workflow-delete-record-action.guard.js.map