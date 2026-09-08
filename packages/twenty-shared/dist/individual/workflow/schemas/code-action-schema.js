import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowCodeActionSettingsSchema as t } from "./code-action-settings-schema.js";
import { z as e } from "zod";
var a = o.extend({
  type: e.literal("CODE"),
  settings: t
});
export {
  a as workflowCodeActionSchema
};

//# sourceMappingURL=code-action-schema.js.map