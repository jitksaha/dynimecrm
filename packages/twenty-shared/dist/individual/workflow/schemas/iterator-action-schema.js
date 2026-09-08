import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowIteratorActionSettingsSchema as t } from "./iterator-action-settings-schema.js";
import { z as r } from "zod";
var a = o.extend({
  type: r.literal("ITERATOR"),
  settings: t
});
export {
  a as workflowIteratorActionSchema
};

//# sourceMappingURL=iterator-action-schema.js.map