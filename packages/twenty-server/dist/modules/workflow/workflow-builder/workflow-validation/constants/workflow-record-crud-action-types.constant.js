"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WORKFLOW_RECORD_CRUD_ACTION_TYPES", {
    enumerable: true,
    get: function() {
        return WORKFLOW_RECORD_CRUD_ACTION_TYPES;
    }
});
const _workflow = require("twenty-shared/workflow");
const WORKFLOW_RECORD_CRUD_ACTION_TYPES = new Set([
    _workflow.WorkflowActionType.CREATE_RECORD,
    _workflow.WorkflowActionType.UPDATE_RECORD,
    _workflow.WorkflowActionType.DELETE_RECORD,
    _workflow.WorkflowActionType.UPSERT_RECORD,
    _workflow.WorkflowActionType.FIND_RECORDS
]);

//# sourceMappingURL=workflow-record-crud-action-types.constant.js.map