import { FieldActorSource as o } from "../../../../types/composite-types/actor.composite-type.js";
import { z as r } from "zod";
import { Temporal as t } from "temporal-polyfill";
var d = r.string().min(1), s = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/, p = r.string().refine((e) => s.test(e.trim()), "Expected a number").transform((e) => parseFloat(e)).refine((e) => Number.isFinite(e), "Expected a finite number"), m = (e, a) => r.string().transform((n, i) => {
  try {
    return e(n);
  } catch {
    return i.addIssue({
      code: "custom",
      message: a
    }), r.NEVER;
  }
}), f = m((e) => t.PlainDate.from(e), 'Expected an ISO date, e.g. "2026-01-31"'), S = m((e) => t.Instant.from(e), 'Expected an ISO date time, e.g. "2026-01-31T00:00:00Z"'), E = m((e) => e.includes("T") ? t.Instant.from(e) : t.PlainDate.from(e), "Expected an ISO date or date time"), h = r.enum(["true", "false"]).transform((e) => e === "true"), F = r.string().transform((e, a) => {
  try {
    return JSON.parse(e);
  } catch (n) {
    return a.addIssue({
      code: "custom",
      message: n.message
    }), r.NEVER;
  }
}).pipe(r.array(r.enum(o)));
export {
  F as actorSourceFilterValueSchema,
  h as booleanFilterValueSchema,
  S as instantFilterValueSchema,
  d as nonEmptyStringFilterValueSchema,
  p as numericFilterValueSchema,
  f as plainDateFilterValueSchema,
  E as plainDateOrInstantFilterValueSchema
};

//# sourceMappingURL=filterValueScalarSchemas.js.map