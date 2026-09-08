import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowDelayActionSettingsSchema as t } from "./workflow-delay-action-settings-schema.js";
import { z as e } from "zod";
var a = o.extend({
  type: e.literal("DELAY"),
  settings: t
});
export {
  a as workflowDelayActionSchema
};

//# sourceMappingURL=workflow-delay-action-schema.js.map