import { z as E } from "zod";
var T = E.enum([
  "NOT_STARTED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "ENQUEUED",
  "STOPPING",
  "STOPPED"
]);
export {
  T as workflowRunStatusSchema
};

//# sourceMappingURL=workflow-run-status-schema.js.map