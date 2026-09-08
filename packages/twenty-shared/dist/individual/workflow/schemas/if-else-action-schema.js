import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowIfElseActionSettingsSchema as t } from "./if-else-action-settings-schema.js";
import { z as e } from "zod";
var f = o.extend({
  type: e.literal("IF_ELSE"),
  settings: t
});
export {
  f as workflowIfElseActionSchema
};

//# sourceMappingURL=if-else-action-schema.js.map