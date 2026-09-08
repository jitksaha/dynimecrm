"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WORKFLOW_VARIABLE_CONSUMING_ACTION_TYPES", {
    enumerable: true,
    get: function() {
        return WORKFLOW_VARIABLE_CONSUMING_ACTION_TYPES;
    }
});
const _workflowrecordcrudactiontypesconstant = require("./workflow-record-crud-action-types.constant");
const _workflow = require("twenty-shared/workflow");
const WORKFLOW_VARIABLE_CONSUMING_ACTION_TYPES = new Set([
    _workflow.WorkflowActionType.HTTP_REQUEST,
    _workflow.WorkflowActionType.CODE,
    _workflow.WorkflowActionType.LOGIC_FUNCTION,
    _workflow.WorkflowActionType.SEND_EMAIL,
    ..._workflowrecordcrudactiontypesconstant.WORKFLOW_RECORD_CRUD_ACTION_TYPES
]);

//# sourceMappingURL=workflow-variable-consuming-action-types.constant.js.map