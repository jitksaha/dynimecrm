import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { expectedOutputSchemaShape as o } from "./expected-output-schema-shape.js";
import { z as e } from "zod";
var a = t.extend({
  input: e.object({
    logicFunctionId: e.string().describe("The ID of the logic function that holds the code. This is auto-generated when a CODE step is created via create_workflow_version_step — do NOT set this manually."),
    logicFunctionInput: e.record(e.string(), e.any()).describe("Key-value map of input parameters to pass to the logic function at runtime.")
  }),
  ...o
});
export {
  a as workflowCodeActionSettingsSchema
};

//# sourceMappingURL=code-action-settings-schema.js.map