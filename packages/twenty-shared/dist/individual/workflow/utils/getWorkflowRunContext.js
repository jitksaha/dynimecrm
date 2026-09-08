import { isDefined as o } from "../../utils/validation/isDefined.js";
var n = (r) => Object.fromEntries(Object.entries(r).filter(([, e]) => o(e?.result)).map(([e, t]) => [e, t?.result]));
export {
  n as getWorkflowRunContext
};

//# sourceMappingURL=getWorkflowRunContext.js.map