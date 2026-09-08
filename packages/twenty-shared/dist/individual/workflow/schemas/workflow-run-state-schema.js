import { workflowActionSchema as r } from "./workflow-action-schema.js";
import { workflowRunStateStepInfosSchema as t } from "./workflow-run-state-step-infos-schema.js";
import { workflowTriggerSchema as e } from "./workflow-trigger-schema.js";
import { z as o } from "zod";
var p = o.object({
  flow: o.object({
    trigger: e,
    steps: o.array(r)
  }),
  stepInfos: t,
  workflowRunError: o.any().optional()
});
export {
  p as workflowRunStateSchema
};

//# sourceMappingURL=workflow-run-state-schema.js.map