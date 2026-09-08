import { z as e } from "zod";
var o = e.object({
  input: e.looseObject({}).describe("Input data for the workflow action. Structure depends on the action type."),
  outputSchema: e.looseObject({}).describe("Schema defining the output data structure. This data can be referenced in subsequent steps using {{stepId.fieldName}}."),
  errorHandlingOptions: e.object({
    retryOnFailure: e.object({ value: e.boolean().describe("Whether to retry the action if it fails.") }),
    continueOnFailure: e.object({ value: e.boolean().describe("Whether to continue to the next step if this action fails.") })
  })
});
export {
  o as baseWorkflowActionSettingsSchema
};

//# sourceMappingURL=base-workflow-action-settings-schema.js.map