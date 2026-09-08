import { baseWorkflowActionSettingsSchema as n } from "./base-workflow-action-settings-schema.js";
import { z as o } from "zod";
var r = n.extend({ input: o.object({
  items: o.union([o.array(o.union([
    o.string(),
    o.number(),
    o.boolean(),
    o.null(),
    o.record(o.string(), o.any()),
    o.any()
  ])), o.string()]).optional(),
  initialLoopStepIds: o.array(o.string()).optional(),
  shouldContinueOnIterationFailure: o.boolean().optional()
}) });
export {
  r as workflowIteratorActionSettingsSchema
};

//# sourceMappingURL=iterator-action-settings-schema.js.map