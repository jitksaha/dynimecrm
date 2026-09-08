import { workflowAiAgentActionSettingsSchema as o } from "./ai-agent-action-settings-schema.js";
import { baseWorkflowActionSchema as t } from "./base-workflow-action-schema.js";
import { z as e } from "zod";
var A = t.extend({
  type: e.literal("AI_AGENT"),
  settings: o
});
export {
  A as workflowAiAgentActionSchema
};

//# sourceMappingURL=ai-agent-action-schema.js.map