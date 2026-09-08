import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowUpdateRecordActionSettingsSchema as t } from "./update-record-action-settings-schema.js";
import { z as e } from "zod";
var a = o.extend({
  type: e.literal("UPDATE_RECORD"),
  settings: t
});
export {
  a as workflowUpdateRecordActionSchema
};

//# sourceMappingURL=update-record-action-schema.js.map