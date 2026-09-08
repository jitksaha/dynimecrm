"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowDraftEmailAction", {
    enumerable: true,
    get: function() {
        return isWorkflowDraftEmailAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowDraftEmailAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.DRAFT_EMAIL;
};

//# sourceMappingURL=is-workflow-draft-email-action.guard.js.map