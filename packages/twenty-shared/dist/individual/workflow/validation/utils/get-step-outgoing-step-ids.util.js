import { isDefined as i } from "../../../utils/validation/isDefined.js";
import { isIfElseStepInput as r } from "../guards/isIfElseStepInput.js";
import { isIteratorStepInput as p } from "../guards/isIteratorStepInput.js";
import { isObject as s } from "@sniptt/guards";
var u = (t) => {
  const n = t.settings?.input;
  if (i(n) && s(n)) return n;
}, g = (t) => {
  const n = new Set(t.nextStepIds ?? []);
  if (r(t)) for (const e of t.settings.input.branches ?? []) for (const o of e?.nextStepIds ?? []) n.add(o);
  if (p(t)) for (const e of t.settings.input.initialLoopStepIds ?? []) n.add(e);
  return [...n];
};
export {
  u as getStepInput,
  g as getStepOutgoingStepIds
};

//# sourceMappingURL=get-step-outgoing-step-ids.util.js.map