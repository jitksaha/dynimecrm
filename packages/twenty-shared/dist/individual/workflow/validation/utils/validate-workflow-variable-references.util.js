import { isDefined as l } from "../../../utils/validation/isDefined.js";
import { TRIGGER_STEP_ID as g } from "../../constants/TriggerStepId.js";
import { parseVariablePath as A } from "../../utils/variable-path.util.js";
import { extractVariablesFromInput as b } from "./extract-variables-from-input.util.js";
import { collectOutputSchemaVariablePaths as v, resolveVariablePathInOutputSchema as S } from "../../workflow-schema/utils/resolve-variable-path-in-output-schema.js";
import { getVariablePathSuggestions as $ } from "./get-variable-path-suggestions.util.js";
import { isNonEmptyArray as u, isObject as I } from "@sniptt/guards";
var D = ({ workflow: r, graph: n, stepsById: o }) => {
  const a = [], f = new Set(r.steps?.map((e) => e.id) ?? []);
  for (const e of r.steps ?? []) {
    const d = b(e.settings?.input), p = n.ancestorsByStepId.get(e.id) ?? /* @__PURE__ */ new Set();
    for (const t of d) {
      const h = A(t), s = h[0];
      if (!l(s)) {
        a.push({
          severity: "error",
          code: "VARIABLE_INVALID_PATH",
          message: `Step "${e.name ?? e.id}" has a variable "{{${t}}}" with an invalid path. Variable references must start with a step ID, e.g. "{{stepId.property}}".`,
          stepId: e.id,
          path: t
        });
        continue;
      }
      const i = s === g;
      if (!i && !f.has(s)) {
        a.push({
          severity: "error",
          code: "VARIABLE_UNKNOWN_STEP",
          message: `Step "${e.name ?? e.id}" references variable "{{${t}}}" from an unknown step "${s}".`,
          stepId: e.id,
          path: t
        });
        continue;
      }
      const m = s === e.id;
      if (!i && !m && !p.has(s)) {
        const c = o.get(s)?.name ?? s;
        a.push({
          severity: "error",
          code: "VARIABLE_NOT_UPSTREAM",
          message: `Step "${e.name ?? e.id}" references variable "{{${t}}}" from step "${c}", which does not run before it. Ensure step "${c}" is an ancestor (connected via nextStepIds chain from the trigger, before this step).`,
          stepId: e.id,
          path: t
        });
        continue;
      }
      a.push(...P({
        step: e,
        variable: t,
        pathSegments: h,
        referencedStepId: s,
        isTriggerReference: i,
        trigger: r.trigger,
        stepsById: o
      }));
    }
  }
  return a;
}, P = ({ step: r, variable: n, pathSegments: o, referencedStepId: a, isTriggerReference: f, trigger: e, stepsById: d }) => {
  const p = o.slice(1);
  if (p.length === 0) return [];
  const t = f ? e?.settings?.outputSchema : d.get(a)?.settings?.outputSchema, h = l(t) && I(t) && !Array.isArray(t) && Object.keys(t).length === 0;
  if (!l(t) || h) return [];
  if (!S({
    schema: t,
    propertyPath: p
  }).found) {
    const s = $({
      schema: t,
      propertyPath: p,
      referencedStepId: a
    }), i = y(t, a), m = u(s) ? `Did you mean "{{${s[0]}}}"?${s.length > 1 ? ` Other options: ${s.slice(1).map((c) => `{{${c}}}`).join(", ")}.` : ""}` : u(i) ? `Available paths: ${i.map((c) => `{{${c}}}`).join(", ")}.` : void 0;
    return [{
      severity: "error",
      code: "VARIABLE_PATH_NOT_FOUND",
      message: `Step "${r.name ?? r.id}" references variable "{{${n}}}" but the path "${p.join(".")}" was not found in the output of step "${a}".`,
      stepId: r.id,
      path: n,
      ...l(m) ? { hint: m } : {},
      ...u(s) ? { suggestions: s } : {},
      ...u(i) ? { availablePaths: i } : {}
    }];
  }
  return [];
}, V = 20, y = (r, n) => v(r).slice(0, V).map((o) => `${n}.${o}`);
export {
  D as validateWorkflowVariableReferences
};

//# sourceMappingURL=validate-workflow-variable-references.util.js.map