import { baseWorkflowActionSettingsSchema as e } from "./base-workflow-action-settings-schema.js";
import { objectRecordSchema as t } from "./object-record-schema.js";
import { z as o } from "zod";
var a = e.extend({ input: o.object({
  objectName: o.string(),
  objectRecord: t,
  objectRecordId: o.string(),
  fieldsToUpdate: o.array(o.string())
}) });
export {
  a as workflowUpdateRecordActionSettingsSchema
};

//# sourceMappingURL=update-record-action-settings-schema.js.map