import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { z as e } from "zod";
var c = t.extend({ input: e.object({
  objectName: e.string(),
  objectRecordId: e.string()
}) });
export {
  c as workflowDeleteRecordActionSettingsSchema
};

//# sourceMappingURL=delete-record-action-settings-schema.js.map