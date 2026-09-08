import { z as t } from "zod";
var e = t.object({
  timestamp: t.string(),
  level: t.enum([
    "debug",
    "info",
    "warn",
    "error"
  ]),
  message: t.string()
}), o = t.object({
  toolName: t.string(),
  toolCallId: t.string(),
  providerExecuted: t.boolean().optional(),
  input: t.unknown().optional(),
  output: t.unknown().optional(),
  errorMessage: t.string().optional(),
  state: t.enum([
    "started",
    "success",
    "error",
    "awaiting-approval"
  ])
}), n = t.object({
  type: t.literal("AI_AGENT"),
  modelId: t.string(),
  usage: t.object({
    inputTokens: t.number(),
    outputTokens: t.number(),
    reasoningTokens: t.number().optional(),
    cacheReadTokens: t.number().optional(),
    cacheCreationTokens: t.number().optional(),
    totalTokens: t.number()
  }),
  cost: t.object({
    totalCostInDollars: t.number(),
    creditsUsedMicro: t.number()
  }),
  nativeWebSearchCallCount: t.number(),
  toolCalls: t.array(o),
  durationMs: t.number()
}), r = t.object({
  type: t.literal("CODE"),
  durationMs: t.number(),
  status: t.enum(["SUCCESS", "ERROR"]),
  error: t.object({
    type: t.string(),
    message: t.string(),
    stackTrace: t.string().optional()
  }).nullable().optional()
}), a = t.object({
  type: t.literal("HTTP_REQUEST"),
  request: t.object({
    method: t.string(),
    url: t.string(),
    headers: t.record(t.string(), t.string()),
    body: t.string().optional(),
    bodyBytes: t.number().optional(),
    bodyTruncated: t.boolean().optional()
  }),
  response: t.object({
    status: t.number(),
    statusText: t.string().optional(),
    headers: t.record(t.string(), t.string()),
    body: t.string().optional(),
    bodyBytes: t.number().optional(),
    bodyTruncated: t.boolean().optional()
  }).optional(),
  error: t.string().optional(),
  durationMs: t.number()
}), i = t.object({
  type: t.literal("EMAIL"),
  mode: t.enum(["SEND", "DRAFT"]),
  status: t.enum(["SUCCESS", "ERROR"]),
  recipients: t.object({
    to: t.array(t.string()),
    cc: t.array(t.string()).optional(),
    bcc: t.array(t.string()).optional()
  }),
  subject: t.string().optional(),
  bodyPreview: t.string().optional(),
  bodyBytes: t.number().optional(),
  bodyTruncated: t.boolean().optional(),
  connectedAccountId: t.string().optional(),
  fromHandle: t.string().optional(),
  attachmentCount: t.number().optional(),
  inReplyTo: t.string().optional(),
  error: t.string().optional(),
  durationMs: t.number()
}), s = t.object({
  type: t.literal("CREATE_CALENDAR_EVENT"),
  status: t.enum(["SUCCESS", "ERROR"]),
  title: t.string().optional(),
  startsAt: t.string().optional(),
  endsAt: t.string().optional(),
  attendeeCount: t.number().optional(),
  conferenceLink: t.string().optional(),
  connectedAccountId: t.string().optional(),
  iCalUid: t.string().optional(),
  error: t.string().optional(),
  durationMs: t.number()
}), l = t.discriminatedUnion("type", [
  n,
  r,
  a,
  i,
  s
]), u = t.object({
  details: l,
  entries: t.array(e),
  truncated: t.object({
    droppedEntries: t.number(),
    droppedBytes: t.number()
  }).optional(),
  sizeBytes: t.number()
}), c = t.record(t.string(), t.unknown());
export {
  u as workflowRunStepLogSchema,
  c as workflowRunStepLogsSchema
};

//# sourceMappingURL=workflow-run-step-log-schema.js.map