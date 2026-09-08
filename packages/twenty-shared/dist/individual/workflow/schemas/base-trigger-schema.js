import { z as e } from "zod";
var t = e.object({
  name: e.string().optional().describe("Human-readable name for the trigger. Optional but recommended for clarity."),
  type: e.enum([
    "DATABASE_EVENT",
    "MANUAL",
    "CRON",
    "WEBHOOK"
  ]).describe("Type of trigger. DATABASE_EVENT for record changes, MANUAL for user-initiated, CRON for scheduled, WEBHOOK for external calls."),
  position: e.object({
    x: e.number(),
    y: e.number()
  }).optional().nullable().describe("Position coordinates for the trigger in the workflow diagram. Use (0, 0) for the trigger step."),
  nextStepIds: e.array(e.string()).optional().nullable().describe("Array of step IDs that the trigger connects to. These are the first steps in the workflow.")
});
export {
  t as baseTriggerSchema
};

//# sourceMappingURL=base-trigger-schema.js.map