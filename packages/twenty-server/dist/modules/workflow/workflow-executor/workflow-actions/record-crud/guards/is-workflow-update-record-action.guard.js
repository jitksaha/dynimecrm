"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowUpdateRecordAction", {
    enumerable: true,
    get: function() {
        return isWorkflowUpdateRecordAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowUpdateRecordAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.UPDATE_RECORD;
};

//# sourceMappingURL=is-workflow-update-record-action.guard.js.map