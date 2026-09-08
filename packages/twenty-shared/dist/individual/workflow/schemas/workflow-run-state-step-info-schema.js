import { workflowRunStepStatusSchema as r } from "./workflow-run-step-status-schema.js";
import { z as t } from "zod";
var o = t.object({
  result: t.any().optional(),
  error: t.any().optional(),
  status: r,
  get history() {
    return t.array(o.pick({
      result: !0,
      status: !0,
      error: !0
    })).optional();
  }
});
export {
  o as workflowRunStateStepInfoSchema
};

//# sourceMappingURL=workflow-run-state-step-info-schema.js.map