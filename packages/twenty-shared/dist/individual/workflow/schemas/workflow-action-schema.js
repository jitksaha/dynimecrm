import { workflowAiAgentActionSchema as o } from "./ai-agent-action-schema.js";
import { workflowCodeActionSchema as r } from "./code-action-schema.js";
import { workflowCreateCalendarEventActionSchema as m } from "./create-calendar-event-action-schema.js";
import { workflowCreateRecordActionSchema as t } from "./create-record-action-schema.js";
import { workflowDeleteRecordActionSchema as i } from "./delete-record-action-schema.js";
import { workflowDraftEmailActionSchema as c } from "./draft-email-action-schema.js";
import { workflowEmptyActionSchema as e } from "./empty-action-schema.js";
import { workflowFilterActionSchema as f } from "./filter-action-schema.js";
import { workflowFindRecordsActionSchema as w } from "./find-records-action-schema.js";
import { workflowFormActionSchema as a } from "./form-action-schema.js";
import { workflowHttpRequestActionSchema as n } from "./http-request-action-schema.js";
import { workflowIfElseActionSchema as l } from "./if-else-action-schema.js";
import { workflowIteratorActionSchema as p } from "./iterator-action-schema.js";
import { workflowLogicFunctionActionSchema as A } from "./logic-function-action-schema.js";
import { workflowPickRecordActionSchema as k } from "./pick-record-action-schema.js";
import { workflowSendEmailActionSchema as S } from "./send-email-action-schema.js";
import { workflowUpdateRecordActionSchema as h } from "./update-record-action-schema.js";
import { workflowUpsertRecordActionSchema as d } from "./upsert-record-action-schema.js";
import { workflowDelayActionSchema as R } from "./workflow-delay-action-schema.js";
import { z as s } from "zod";
var J = s.discriminatedUnion("type", [
  r,
  A,
  S,
  c,
  m,
  t,
  h,
  i,
  d,
  w,
  k,
  a,
  n,
  o,
  f,
  l,
  p,
  R,
  e
]);
export {
  J as workflowActionSchema
};

//# sourceMappingURL=workflow-action-schema.js.map