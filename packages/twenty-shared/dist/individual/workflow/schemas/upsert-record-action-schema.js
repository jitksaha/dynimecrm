import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowUpsertRecordActionSettingsSchema as r } from "./upsert-record-action-settings-schema.js";
import { z as t } from "zod";
var c = o.extend({
  type: t.literal("UPSERT_RECORD"),
  settings: r
});
export {
  c as workflowUpsertRecordActionSchema
};

//# sourceMappingURL=upsert-record-action-schema.js.map