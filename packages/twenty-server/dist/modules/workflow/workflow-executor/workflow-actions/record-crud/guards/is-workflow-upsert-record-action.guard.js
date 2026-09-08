"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowUpsertRecordAction", {
    enumerable: true,
    get: function() {
        return isWorkflowUpsertRecordAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowUpsertRecordAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.UPSERT_RECORD;
};

//# sourceMappingURL=is-workflow-upsert-record-action.guard.js.map