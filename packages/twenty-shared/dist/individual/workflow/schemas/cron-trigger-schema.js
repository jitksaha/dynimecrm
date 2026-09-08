import { baseTriggerSchema as t } from "./base-trigger-schema.js";
import { z as e } from "zod";
var r = t.extend({
  type: e.literal("CRON"),
  settings: e.discriminatedUnion("type", [
    e.object({
      type: e.literal("DAYS"),
      schedule: e.object({
        day: e.number().min(1),
        hour: e.number().min(0).max(23),
        minute: e.number().min(0).max(59)
      }),
      outputSchema: e.looseObject({})
    }),
    e.object({
      type: e.literal("HOURS"),
      schedule: e.object({
        hour: e.number().min(1),
        minute: e.number().min(0).max(59)
      }),
      outputSchema: e.looseObject({})
    }),
    e.object({
      type: e.literal("MINUTES"),
      schedule: e.object({ minute: e.number().min(1).max(60) }),
      outputSchema: e.looseObject({})
    }),
    e.object({
      type: e.literal("CUSTOM"),
      pattern: e.string(),
      outputSchema: e.looseObject({})
    })
  ])
});
export {
  r as workflowCronTriggerSchema
};

//# sourceMappingURL=cron-trigger-schema.js.map