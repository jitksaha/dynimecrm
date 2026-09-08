import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowCreateRecordActionSettingsSchema as e } from "./create-record-action-settings-schema.js";
import { z as r } from "zod";
var a = o.extend({
  type: r.literal("CREATE_RECORD"),
  settings: e
});
export {
  a as workflowCreateRecordActionSchema
};

//# sourceMappingURL=create-record-action-schema.js.map