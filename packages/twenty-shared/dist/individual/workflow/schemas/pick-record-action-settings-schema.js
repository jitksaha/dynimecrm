import { isDefined as r } from "../../utils/validation/isDefined.js";
import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { z as e } from "zod";
var i = e.enum([
  "RANDOM",
  "ROUND_ROBIN",
  "LOAD_BALANCED"
]), d = t.extend({ input: e.object({
  objectName: e.string(),
  strategy: i,
  recordIds: e.array(e.string()),
  loadBalance: e.object({
    objectNameSingular: e.string(),
    fieldName: e.string()
  }).optional()
}).superRefine((a, o) => {
  a.strategy === "LOAD_BALANCED" && !r(a.loadBalance) && o.addIssue({
    code: e.ZodIssueCode.custom,
    path: ["loadBalance"],
    message: "loadBalance is required when strategy is LOAD_BALANCED"
  });
}) });
export {
  d as workflowPickRecordActionSettingsSchema,
  i as workflowPickRecordStrategySchema
};

//# sourceMappingURL=pick-record-action-settings-schema.js.map