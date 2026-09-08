import { baseWorkflowActionSettingsSchema as o } from "./base-workflow-action-settings-schema.js";
import { z as t } from "zod";
var e = o.extend({ input: t.object({
  agentId: t.string().optional(),
  prompt: t.string().optional()
}) });
export {
  e as workflowAiAgentActionSettingsSchema
};

//# sourceMappingURL=ai-agent-action-settings-schema.js.map