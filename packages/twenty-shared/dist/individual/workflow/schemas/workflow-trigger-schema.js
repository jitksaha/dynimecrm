import { workflowCronTriggerSchema as r } from "./cron-trigger-schema.js";
import { workflowDatabaseEventTriggerSchema as o } from "./database-event-trigger-schema.js";
import { workflowManualTriggerSchema as e } from "./manual-trigger-schema.js";
import { workflowWebhookTriggerSchema as m } from "./webhook-trigger-schema.js";
import { z as i } from "zod";
var p = i.discriminatedUnion("type", [
  o,
  e,
  r,
  m
]);
export {
  p as workflowTriggerSchema
};

//# sourceMappingURL=workflow-trigger-schema.js.map