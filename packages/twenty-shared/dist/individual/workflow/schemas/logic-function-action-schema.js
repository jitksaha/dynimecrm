import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowLogicFunctionActionSettingsSchema as t } from "./logic-function-action-settings-schema.js";
import { z as i } from "zod";
var n = o.extend({
  type: i.literal("LOGIC_FUNCTION"),
  settings: t
});
export {
  n as workflowLogicFunctionActionSchema
};

//# sourceMappingURL=logic-function-action-schema.js.map