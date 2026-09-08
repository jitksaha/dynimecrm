import { isDefined as p } from "../../../utils/validation/isDefined.js";
import { WorkflowActionType as c } from "../../types/WorkflowActionType.js";
import { getStepInput as h } from "./get-step-outgoing-step-ids.util.js";
var S = ({ workflow: t, graph: o }) => {
  const r = [], s = t.steps ?? [], i = new Set(s.map((e) => e.id)), n = /* @__PURE__ */ new Set();
  for (const e of s)
    n.has(e.id) && r.push({
      severity: "error",
      code: "DUPLICATE_STEP_ID",
      message: `Duplicate step id "${e.id}". Every step id must be unique within the workflow.`,
      stepId: e.id
    }), n.add(e.id);
  const a = (t.trigger?.nextStepIds ?? []).filter(p);
  s.length > 0 && a.length === 0 && r.push({
    severity: "error",
    code: "TRIGGER_HAS_NO_NEXT_STEP",
    message: `The trigger is not connected to any step. The trigger must have a "nextStepIds" array pointing to the first step (e.g. nextStepIds: ["${s[0].id}"]). If you used edges, also set trigger.nextStepIds.`
  });
  for (const e of a) i.has(e) || r.push({
    severity: "error",
    code: "DANGLING_REFERENCE",
    message: `The trigger references a non-existent step "${e}".`
  });
  for (const e of s) {
    for (const d of o.childrenByStepId.get(e.id) ?? []) i.has(d) || r.push({
      severity: "error",
      code: "DANGLING_REFERENCE",
      message: `Step "${e.name ?? e.id}" references a non-existent step "${d}".`,
      stepId: e.id
    });
    r.push(...I(e));
  }
  for (const e of s) o.reachableFromTrigger.has(e.id) || r.push({
    severity: "error",
    code: "UNREACHABLE_STEP",
    message: `Step "${e.name ?? e.id}" is not reachable from the trigger. Ensure a chain of nextStepIds connects the trigger to this step. Check that the preceding step includes this step's id ("${e.id}") in its nextStepIds array.`,
    stepId: e.id
  });
  return r;
}, I = (t) => {
  const o = [], r = h(t);
  if (t.type === c.IF_ELSE) {
    const s = r?.branches, i = Array.isArray(s) ? s : [];
    i.length < 2 && o.push({
      severity: "warning",
      code: "IF_ELSE_INSUFFICIENT_BRANCHES",
      message: `If/Else step "${t.name ?? t.id}" should have at least two branches (a condition branch and an else branch).`,
      stepId: t.id
    });
    const n = r?.stepFilterGroups, a = new Set((Array.isArray(n) ? n : []).filter(p).map((e) => e.id));
    for (const e of i) {
      const d = e?.nextStepIds;
      (!Array.isArray(d) || d.length === 0) && o.push({
        severity: "error",
        code: "IF_ELSE_BRANCH_HAS_NO_NEXT_STEP",
        message: `A branch of If/Else step "${t.name ?? t.id}" is not connected to any step.`,
        stepId: t.id
      }), p(e?.filterGroupId) && !a.has(e.filterGroupId) && o.push({
        severity: "error",
        code: "INVALID_STEP_PARAMS",
        message: `A branch of If/Else step "${t.name ?? t.id}" references filter group "${e.filterGroupId}", which does not exist.`,
        stepId: t.id
      });
    }
  }
  if (t.type === c.ITERATOR) {
    const s = r, i = s?.items, n = typeof i == "string" && i.length > 0 || Array.isArray(i) && i.length > 0, a = s?.initialLoopStepIds, e = Array.isArray(a) && a.length > 0;
    n && !e && o.push({
      severity: "error",
      code: "ITERATOR_MISSING_LOOP_BODY",
      message: `Iterator step "${t.name ?? t.id}" has items to iterate over but no steps inside the loop.`,
      stepId: t.id
    });
  }
  return o;
};
export {
  S as validateWorkflowGraph
};

//# sourceMappingURL=validate-workflow-graph.util.js.map