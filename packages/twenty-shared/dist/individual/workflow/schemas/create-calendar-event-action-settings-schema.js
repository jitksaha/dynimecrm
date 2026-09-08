import { baseWorkflowActionSettingsSchema as n } from "./base-workflow-action-settings-schema.js";
import { z as t } from "zod";
var i = n.extend({ input: t.object({
  connectedAccountId: t.string(),
  title: t.string(),
  description: t.string().optional(),
  location: t.string().optional(),
  startsAt: t.string(),
  endsAt: t.string(),
  isFullDay: t.boolean(),
  timeZone: t.string().optional(),
  attendees: t.string().optional().default(""),
  sendInvitations: t.boolean(),
  addConferencing: t.boolean()
}) });
export {
  i as workflowCreateCalendarEventActionSettingsSchema
};

//# sourceMappingURL=create-calendar-event-action-settings-schema.js.map