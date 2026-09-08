import { baseWorkflowActionSchema as e } from "./base-workflow-action-schema.js";
import { workflowCreateCalendarEventActionSettingsSchema as t } from "./create-calendar-event-action-settings-schema.js";
import { z as o } from "zod";
var i = e.extend({
  type: o.literal("CREATE_CALENDAR_EVENT"),
  settings: t
});
export {
  i as workflowCreateCalendarEventActionSchema
};

//# sourceMappingURL=create-calendar-event-action-schema.js.map