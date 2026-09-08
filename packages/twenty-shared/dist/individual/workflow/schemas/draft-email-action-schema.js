import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowSendEmailActionSettingsSchema as t } from "./send-email-action-settings-schema.js";
import { z as r } from "zod";
var a = o.extend({
  type: r.literal("DRAFT_EMAIL"),
  settings: t
});
export {
  a as workflowDraftEmailActionSchema
};

//# sourceMappingURL=draft-email-action-schema.js.map