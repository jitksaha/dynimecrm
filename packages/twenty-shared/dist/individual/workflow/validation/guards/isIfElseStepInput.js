import { WorkflowActionType as i } from "../../types/WorkflowActionType.js";
import { isObject as n } from "@sniptt/guards";
var p = (t) => {
  const r = t.settings?.input;
  return t.type === i.IF_ELSE && n(r) && "branches" in r && Array.isArray(r.branches);
};
export {
  p as isIfElseStepInput
};

//# sourceMappingURL=isIfElseStepInput.js.map