import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowFormActionSettingsSchema as r } from "./form-action-settings-schema.js";
import { z as t } from "zod";
var a = o.extend({
  type: t.literal("FORM"),
  settings: r
});
export {
  a as workflowFormActionSchema
};

//# sourceMappingURL=form-action-schema.js.map