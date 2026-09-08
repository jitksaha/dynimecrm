"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowFindRecordsAction", {
    enumerable: true,
    get: function() {
        return isWorkflowFindRecordsAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowFindRecordsAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.FIND_RECORDS;
};

//# sourceMappingURL=is-workflow-find-records-action.guard.js.map