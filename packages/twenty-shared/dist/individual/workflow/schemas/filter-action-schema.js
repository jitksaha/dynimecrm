import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowFilterActionSettingsSchema as t } from "./filter-action-settings-schema.js";
import { z as r } from "zod";
var l = o.extend({
  type: r.literal("FILTER"),
  settings: t
});
export {
  l as workflowFilterActionSchema
};

//# sourceMappingURL=filter-action-schema.js.map