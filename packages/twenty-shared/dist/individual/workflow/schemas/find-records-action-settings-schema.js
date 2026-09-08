import { baseWorkflowActionSettingsSchema as e } from "./base-workflow-action-settings-schema.js";
import { workflowVariableReferenceSchema as r } from "./workflow-variable-reference-schema.js";
import { z as o } from "zod";
var i = e.extend({ input: o.object({
  objectName: o.string(),
  limit: o.union([o.number(), r]).optional(),
  offset: o.union([o.number().int().nonnegative(), r]).optional(),
  filter: o.object({
    recordFilterGroups: o.array(o.any()).optional(),
    recordFilters: o.array(o.any()).optional()
  }).optional(),
  orderBy: o.object({
    recordSorts: o.array(o.any()).optional(),
    gqlOperationOrderBy: o.array(o.record(o.string(), o.any())).optional()
  }).optional()
}) });
export {
  i as workflowFindRecordsActionSettingsSchema
};

//# sourceMappingURL=find-records-action-settings-schema.js.map