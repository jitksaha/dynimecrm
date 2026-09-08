// Base system prompt for programmatic agent runs outside workflows (runAgent API, evaluations)
// NOTE: For user-facing chat, use CHAT_SYSTEM_PROMPTS from ai-chat/constants
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AGENT_RUN_BASE_SYSTEM_PROMPT", {
    enumerable: true,
    get: function() {
        return AGENT_RUN_BASE_SYSTEM_PROMPT;
    }
});
const _toolusagestrategyconst = require("./tool-usage-strategy.const");
const AGENT_RUN_BASE_SYSTEM_PROMPT = `You are an AI agent in Twenty CRM, invoked programmatically to complete a request.

${_toolusagestrategyconst.TOOL_USAGE_STRATEGY}

Response:
- Your response is returned to the caller and may be shown directly to a person or processed by software
- Answer the request completely and directly
`;

//# sourceMappingURL=agent-run-base-system-prompt.const.js.map