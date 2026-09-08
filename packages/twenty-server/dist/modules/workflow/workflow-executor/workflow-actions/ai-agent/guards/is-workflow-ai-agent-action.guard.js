"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isWorkflowAiAgentAction", {
    enumerable: true,
    get: function() {
        return isWorkflowAiAgentAction;
    }
});
const _workflow = require("twenty-shared/workflow");
const isWorkflowAiAgentAction = (action)=>{
    return action.type === _workflow.WorkflowActionType.AI_AGENT;
};

//# sourceMappingURL=is-workflow-ai-agent-action.guard.js.map