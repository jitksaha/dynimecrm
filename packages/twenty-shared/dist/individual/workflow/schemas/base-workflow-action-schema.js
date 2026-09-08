import { z as e } from "zod";
var o = e.object({
  id: e.uuid().describe("Unique UUID identifier for the workflow step. Must be a valid UUID v4, unique within the workflow."),
  name: e.string().describe("Human-readable name for the workflow step. Should clearly describe what the step does."),
  valid: e.boolean().describe("Whether the step configuration is valid. Set to true when all required fields are properly configured."),
  nextStepIds: e.array(e.uuid()).optional().nullable().describe("Array of step IDs that this step connects to. Leave empty or null for the final step."),
  position: e.object({
    x: e.number(),
    y: e.number()
  }).optional().nullable().describe("Position coordinates for the step in the workflow diagram.")
});
export {
  o as baseWorkflowActionSchema
};

//# sourceMappingURL=base-workflow-action-schema.js.map