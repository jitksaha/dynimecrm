import { baseWorkflowActionSchema as t } from "./base-workflow-action-schema.js";
import { workflowHttpRequestActionSettingsSchema as o } from "./http-request-action-settings-schema.js";
import { z as e } from "zod";
var p = t.extend({
  type: e.literal("HTTP_REQUEST"),
  settings: o
});
export {
  p as workflowHttpRequestActionSchema
};

//# sourceMappingURL=http-request-action-schema.js.map