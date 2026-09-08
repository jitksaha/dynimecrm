import { baseTriggerSchema as t } from "./base-trigger-schema.js";
import { stepFilterGroupSchema as r } from "./step-filter-group-schema.js";
import { stepFilterSchema as a } from "./step-filter-schema.js";
import { z as e } from "zod";
var c = t.extend({
  type: e.literal("DATABASE_EVENT"),
  settings: e.object({
    eventName: e.string().regex(/^[a-z][a-zA-Z0-9_]*\.(created|updated|deleted|upserted)$/, 'Event name must follow the pattern: objectName.action (e.g., "company.created", "person.updated", "company.upserted")').describe('Event name in format: objectName.action (e.g., "company.created", "person.updated", "task.deleted", "company.upserted"). Use lowercase object names.'),
    input: e.looseObject({}).optional(),
    outputSchema: e.looseObject({}).describe("Schema defining the output data structure. For database events, this includes the record that triggered the workflow accessible via {{trigger.object.fieldName}}."),
    objectType: e.string().optional(),
    fields: e.array(e.string()).optional().nullable(),
    filter: e.object({
      stepFilterGroups: e.array(r),
      stepFilters: e.array(a)
    }).optional().describe("Optional condition evaluated against the triggering record. The workflow only runs when the record matches; non-matching events are skipped before a run is created.")
  })
}).describe("Database event trigger that fires when a record is created, updated, deleted, or upserted. The triggered record is accessible in workflow steps via {{trigger.object.fieldName}}.");
export {
  c as workflowDatabaseEventTriggerSchema
};

//# sourceMappingURL=database-event-trigger-schema.js.map