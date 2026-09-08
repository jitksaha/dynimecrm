import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { workflowFileSchema as e } from "./workflow-file-action-schema.js";
import { workflowVariableReferenceSchema as i } from "./workflow-variable-reference-schema.js";
import { z as o } from "zod";
var r = o.array(o.union([e, i.describe("A workflow variable reference resolving to files")])).optional().default([]), f = t.extend({ input: o.object({
  connectedAccountId: o.string(),
  fromHandle: o.string().trim().optional(),
  recipients: o.object({
    to: o.string().optional().default(""),
    cc: o.string().optional().default(""),
    bcc: o.string().optional().default("")
  }),
  subject: o.string().optional(),
  body: o.string().optional(),
  files: r,
  inReplyTo: o.string().trim().optional()
}) });
export {
  r as workflowEmailFilesSchema,
  f as workflowSendEmailActionSettingsSchema
};

//# sourceMappingURL=send-email-action-settings-schema.js.map