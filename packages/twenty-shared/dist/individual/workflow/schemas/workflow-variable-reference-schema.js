import { z as e } from "zod";
var a = e.string().regex(/^{{[^{}]+}}$/, "Expected a workflow variable reference like {{stepId.path}}");
export {
  a as workflowVariableReferenceSchema
};

//# sourceMappingURL=workflow-variable-reference-schema.js.map