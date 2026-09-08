import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { stepFilterGroupSchema as e } from "./step-filter-group-schema.js";
import { stepFilterSchema as o } from "./step-filter-schema.js";
import { z as r } from "zod";
var s = t.extend({ input: r.object({
  stepFilterGroups: r.array(e),
  stepFilters: r.array(o)
}) });
export {
  s as workflowFilterActionSettingsSchema
};

//# sourceMappingURL=filter-action-settings-schema.js.map