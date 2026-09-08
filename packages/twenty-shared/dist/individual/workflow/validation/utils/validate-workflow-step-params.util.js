import { isDefined as n } from "../../../utils/validation/isDefined.js";
import { workflowActionSchema as f } from "../../schemas/workflow-action-schema.js";
import { workflowTriggerSchema as c } from "../../schemas/workflow-trigger-schema.js";
var m = (e) => e.map((s) => String(s)).join("."), p = (e) => {
  const s = m(e.path), o = s.length > 0 ? `${s}: ${e.message}` : e.message;
  return e.code === "invalid_type" && s.length > 0 ? `${o}. Ensure the field "${s}" exists at the correct nesting level in the step object (not inside "input").` : o;
}, i = (e) => e.issues.map(p), u = ({ trigger: e, steps: s }) => {
  const o = [];
  if (n(e)) {
    const r = c.safeParse(e);
    if (!r.success) for (const t of i(r.error)) o.push({
      severity: "error",
      code: "INVALID_TRIGGER_PARAMS",
      message: `Trigger configuration is invalid - ${t}`
    });
  }
  for (const r of s ?? []) {
    const t = f.safeParse(r);
    if (!t.success) for (const a of i(t.error)) o.push({
      severity: "error",
      code: "INVALID_STEP_PARAMS",
      message: `Step "${r.name ?? r.id}" configuration is invalid - ${a}`,
      stepId: r.id
    });
  }
  return o;
};
export {
  u as validateWorkflowStepParams
};

//# sourceMappingURL=validate-workflow-step-params.util.js.map