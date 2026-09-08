import { WorkflowActionType as o } from "../../types/WorkflowActionType.js";
import { isNonEmptyArray as p, isObject as r } from "@sniptt/guards";
var s = (i) => {
  const t = i.settings?.input;
  return i.type === o.ITERATOR && r(t) && "initialLoopStepIds" in t && p(t.initialLoopStepIds);
};
export {
  s as isIteratorStepInput
};

//# sourceMappingURL=isIteratorStepInput.js.map