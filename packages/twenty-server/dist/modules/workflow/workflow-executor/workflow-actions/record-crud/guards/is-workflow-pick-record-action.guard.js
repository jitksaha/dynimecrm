"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowPickRecordAction", {
    enumerable: true,
    get: function() {
        return isWorkflowPickRecordAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowPickRecordAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.PICK_RECORD;
};

//# sourceMappingURL=is-workflow-pick-record-action.guard.js.map