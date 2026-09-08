import { baseWorkflowActionSchema as e } from "./base-workflow-action-schema.js";
import { workflowDeleteRecordActionSettingsSchema as o } from "./delete-record-action-settings-schema.js";
import { z as t } from "zod";
var c = e.extend({
  type: t.literal("DELETE_RECORD"),
  settings: o
});
export {
  c as workflowDeleteRecordActionSchema
};

//# sourceMappingURL=delete-record-action-schema.js.map