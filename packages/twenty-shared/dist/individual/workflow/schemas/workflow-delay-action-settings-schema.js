import { baseWorkflowActionSettingsSchema as o } from "./base-workflow-action-settings-schema.js";
import { z as n } from "zod";
var e = o.extend({ input: n.object({
  delayType: n.enum(["SCHEDULED_DATE", "DURATION"]),
  scheduledDateTime: n.string().nullable().optional(),
  duration: n.object({
    days: n.union([n.number().min(0), n.string()]).optional(),
    hours: n.union([n.number().min(0), n.string()]).optional(),
    minutes: n.union([n.number().min(0), n.string()]).optional(),
    seconds: n.union([n.number().min(0), n.string()]).optional()
  }).optional()
}) });
export {
  e as workflowDelayActionSettingsSchema
};

//# sourceMappingURL=workflow-delay-action-settings-schema.js.map