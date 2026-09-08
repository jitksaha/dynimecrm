import { isDefined as d } from "../../../utils/validation/isDefined.js";
import { TRIGGER_STEP_ID as f } from "../../constants/TriggerStepId.js";
import { getStepOutgoingStepIds as a } from "./get-step-outgoing-step-ids.util.js";
var u = ({ trigger: p, steps: r }) => {
  const n = /* @__PURE__ */ new Map(), o = d(p?.nextStepIds) ? p.nextStepIds.filter(d) : [];
  n.set(f, o);
  for (const t of r ?? []) n.set(t.id, a(t));
  const e = /* @__PURE__ */ new Set(), s = [f];
  for (; s.length > 0; ) {
    const t = s.shift();
    if (!(!d(t) || e.has(t))) {
      e.add(t);
      for (const c of n.get(t) ?? []) e.has(c) || s.push(c);
    }
  }
  return {
    childrenByStepId: n,
    reachableFromTrigger: e,
    ancestorsByStepId: i(n)
  };
}, i = (p) => {
  const r = /* @__PURE__ */ new Map();
  for (const [o, e] of p.entries()) for (const s of e) {
    const t = r.get(s) ?? /* @__PURE__ */ new Set();
    t.add(o), r.set(s, t);
  }
  const n = /* @__PURE__ */ new Map();
  for (const o of p.keys()) {
    if (n.has(o)) continue;
    const e = /* @__PURE__ */ new Set(), s = [...r.get(o) ?? []];
    for (; s.length > 0; ) {
      const t = s.shift();
      if (!e.has(t)) {
        e.add(t);
        for (const c of r.get(t) ?? []) e.has(c) || s.push(c);
      }
    }
    n.set(o, e);
  }
  return n;
};
export {
  u as buildWorkflowGraph
};

//# sourceMappingURL=build-workflow-graph.util.js.map