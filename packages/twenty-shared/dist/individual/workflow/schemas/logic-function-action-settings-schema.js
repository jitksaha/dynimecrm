import { baseWorkflowActionSettingsSchema as o } from "./base-workflow-action-settings-schema.js";
import { expectedOutputSchemaShape as i } from "./expected-output-schema-shape.js";
import { z as t } from "zod";
var r = o.extend({
  input: t.object({
    logicFunctionId: t.string(),
    logicFunctionInput: t.record(t.string(), t.any())
  }),
  ...i
});
export {
  r as workflowLogicFunctionActionSettingsSchema
};

//# sourceMappingURL=logic-function-action-settings-schema.js.map