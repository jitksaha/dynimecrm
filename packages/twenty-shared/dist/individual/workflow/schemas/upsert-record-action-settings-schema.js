import { baseWorkflowActionSettingsSchema as e } from "./base-workflow-action-settings-schema.js";
import { objectRecordSchema as t } from "./object-record-schema.js";
import { z as o } from "zod";
var i = e.extend({ input: o.object({
  objectName: o.string(),
  objectRecord: t
}) });
export {
  i as workflowUpsertRecordActionSettingsSchema
};

//# sourceMappingURL=upsert-record-action-settings-schema.js.map