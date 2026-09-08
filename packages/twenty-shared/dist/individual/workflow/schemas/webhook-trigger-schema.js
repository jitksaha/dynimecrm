import { baseTriggerSchema as t } from "./base-trigger-schema.js";
import { z as e } from "zod";
var a = t.extend({
  type: e.literal("WEBHOOK"),
  settings: e.discriminatedUnion("httpMethod", [e.object({
    outputSchema: e.looseObject({}),
    httpMethod: e.literal("GET"),
    authentication: e.literal("API_KEY").nullable()
  }), e.object({
    outputSchema: e.looseObject({}),
    expectedOutputSchema: e.looseObject({}).optional(),
    httpMethod: e.literal("POST"),
    expectedBody: e.looseObject({}),
    authentication: e.literal("API_KEY").nullable()
  })])
});
export {
  a as workflowWebhookTriggerSchema
};

//# sourceMappingURL=webhook-trigger-schema.js.map