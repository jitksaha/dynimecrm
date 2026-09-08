import { baseWorkflowActionSettingsSchema as t } from "./base-workflow-action-settings-schema.js";
import { expectedOutputSchemaShape as r } from "./expected-output-schema-shape.js";
import { z as o } from "zod";
var a = t.extend({
  input: o.object({
    url: o.string(),
    method: o.enum([
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ]),
    headers: o.record(o.string(), o.string()).optional(),
    body: o.record(o.string(), o.union([
      o.string(),
      o.number(),
      o.boolean(),
      o.null(),
      o.array(o.union([
        o.string(),
        o.number(),
        o.boolean(),
        o.null()
      ]))
    ])).or(o.string()).optional()
  }),
  ...r
});
export {
  a as workflowHttpRequestActionSettingsSchema
};

//# sourceMappingURL=http-request-action-settings-schema.js.map