import { baseWorkflowActionSettingsSchema as o } from "./base-workflow-action-settings-schema.js";
import { objectRecordSchema as t } from "./object-record-schema.js";
import { z as e } from "zod";
var i = o.extend({ input: e.object({
  objectName: e.string().describe('The name of the object to create a record in. Must be lowercase (e.g., "person", "company", "task").'),
  objectRecord: t.describe("The record data to create.")
}) });
export {
  i as workflowCreateRecordActionSettingsSchema
};

//# sourceMappingURL=create-record-action-settings-schema.js.map