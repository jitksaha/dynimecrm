import { baseWorkflowActionSchema as o } from "./base-workflow-action-schema.js";
import { workflowFindRecordsActionSettingsSchema as r } from "./find-records-action-settings-schema.js";
import { z as t } from "zod";
var c = o.extend({
  type: t.literal("FIND_RECORDS"),
  settings: r
});
export {
  c as workflowFindRecordsActionSchema
};

//# sourceMappingURL=find-records-action-schema.js.map