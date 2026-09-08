import { isDefined as a } from "../../utils/validation/isDefined.js";
import { buildWorkflowGraph as n } from "./utils/build-workflow-graph.util.js";
import { validateWorkflowGraph as h } from "./utils/validate-workflow-graph.util.js";
import { validateWorkflowStepParams as g } from "./utils/validate-workflow-step-params.util.js";
import { validateWorkflowVariableReferences as l } from "./utils/validate-workflow-variable-references.util.js";
var p = (r) => {
  const e = r.filter((t) => t.severity === "error"), s = r.filter((t) => t.severity === "warning");
  return {
    valid: e.length === 0,
    errors: e,
    warnings: s
  };
}, c = (r) => {
  const e = [];
  a(r.trigger) ? a(r.trigger.type) || e.push({
    severity: "error",
    code: "MISSING_TRIGGER_TYPE",
    message: "The workflow trigger has no type."
  }) : e.push({
    severity: "error",
    code: "MISSING_TRIGGER",
    message: "The workflow has no trigger."
  });
  const s = r.steps ?? [];
  if (s.length === 0)
    return e.push({
      severity: "error",
      code: "NO_STEPS",
      message: "The workflow has no steps."
    }), p(e);
  const t = new Map(s.map((o) => [o.id, o])), i = n(r);
  return e.push(...h({
    workflow: r,
    graph: i
  })), e.push(...g(r)), e.push(...l({
    workflow: r,
    graph: i,
    stepsById: t
  })), p(e);
};
export {
  c as validateWorkflowStructure
};

//# sourceMappingURL=validate-workflow-structure.util.js.map