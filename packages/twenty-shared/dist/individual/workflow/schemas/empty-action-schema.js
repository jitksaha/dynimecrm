import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowEmptyActionSettingsSchema as t } from "./empty-action-settings-schema.js";
import { z as r } from "zod";
var p = o.extend({
  type: r.literal("EMPTY"),
  settings: t
});
export {
  p as workflowEmptyActionSchema
};

//# sourceMappingURL=empty-action-schema.js.map