import { workflowRunStateSchema as o } from "./workflow-run-state-schema.js";
import { workflowRunStatusSchema as e } from "./workflow-run-status-schema.js";
import { workflowRunStepLogsSchema as r } from "./workflow-run-step-log-schema.js";
import { z as t } from "zod";
var i = t.looseObject({
  __typename: t.literal("WorkflowRun"),
  id: t.string(),
  workflowVersionId: t.string(),
  workflowId: t.string(),
  state: o.nullable(),
  stepLogs: r.nullable().optional(),
  status: e,
  createdAt: t.string(),
  deletedAt: t.string().nullable(),
  endedAt: t.string().nullable(),
  name: t.string()
});
export {
  i as workflowRunSchema
};

//# sourceMappingURL=workflow-run-schema.js.map