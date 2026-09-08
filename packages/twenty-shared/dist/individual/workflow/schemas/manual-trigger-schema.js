import { baseTriggerSchema as t } from "./base-trigger-schema.js";
import { z as e } from "zod";
var r = t.extend({
  type: e.literal("MANUAL"),
  settings: e.object({
    objectType: e.string().optional(),
    outputSchema: e.looseObject({}).describe("Schema defining the output data structure. When a record is selected, it is accessible via {{trigger.record.fieldName}}. When no record is selected, no data is available."),
    icon: e.string().optional(),
    isPinned: e.boolean().optional(),
    availability: e.discriminatedUnion("type", [
      e.object({
        type: e.literal("GLOBAL"),
        locations: e.array(e.string()).optional()
      }),
      e.object({
        type: e.literal("SINGLE_RECORD"),
        objectNameSingular: e.string()
      }),
      e.object({
        type: e.literal("BULK_RECORDS"),
        objectNameSingular: e.string()
      })
    ]).optional().nullable()
  })
}).describe("Manual trigger that can be launched by the user. If a record is selected when launched, it is accessible via {{trigger.record.fieldName}}. If no record is selected, no data context is available.");
export {
  r as workflowManualTriggerSchema
};

//# sourceMappingURL=manual-trigger-schema.js.map