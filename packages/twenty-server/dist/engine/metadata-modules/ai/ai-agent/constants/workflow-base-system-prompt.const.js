"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WORKFLOW_BASE_SYSTEM_PROMPT", {
    enumerable: true,
    get: function() {
        return WORKFLOW_BASE_SYSTEM_PROMPT;
    }
});
const _toolusagestrategyconst = require("./tool-usage-strategy.const");
const WORKFLOW_BASE_SYSTEM_PROMPT = `You are executing as part of a workflow automation in Twenty CRM.

${_toolusagestrategyconst.TOOL_USAGE_STRATEGY}

Context:
- Your output may be used by downstream workflow nodes
- Be thorough and include all relevant data
- Focus on completing the task efficiently

Permissions:
- Only perform actions your role allows`;

//# sourceMappingURL=workflow-base-system-prompt.const.js.map