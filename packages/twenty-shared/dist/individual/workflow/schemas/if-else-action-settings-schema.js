import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { stepFilterGroupSchema as e } from "./step-filter-group-schema.js";
import { stepFilterSchema as o } from "./step-filter-schema.js";
import { z as r } from "zod";
var a = r.object({
  id: r.string(),
  nextStepIds: r.array(r.string()),
  filterGroupId: r.string().optional()
}), n = t.extend({ input: r.object({
  stepFilterGroups: r.array(e),
  stepFilters: r.array(o),
  branches: r.array(a)
}) });
export {
  a as stepIfElseBranchSchema,
  n as workflowIfElseActionSettingsSchema
};

//# sourceMappingURL=if-else-action-settings-schema.js.map