import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowPickRecordActionSettingsSchema as r } from "./pick-record-action-settings-schema.js";
import { z as t } from "zod";
var m = o.extend({
  type: t.literal("PICK_RECORD"),
  settings: r
});
export {
  m as workflowPickRecordActionSchema
};

//# sourceMappingURL=pick-record-action-schema.js.map