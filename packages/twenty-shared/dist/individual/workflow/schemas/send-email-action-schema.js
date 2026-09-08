import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowSendEmailActionSettingsSchema as t } from "./send-email-action-settings-schema.js";
import { z as e } from "zod";
var a = o.extend({
  type: e.literal("SEND_EMAIL"),
  settings: t
});
export {
  a as workflowSendEmailActionSchema
};

//# sourceMappingURL=send-email-action-schema.js.map