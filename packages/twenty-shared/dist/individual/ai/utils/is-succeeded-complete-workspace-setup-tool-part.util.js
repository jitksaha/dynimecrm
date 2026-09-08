import { isCompleteWorkspaceSetupToolPart as o } from "./is-complete-workspace-setup-tool-part.util.js";
var r = (t) => {
  if (!o(t)) return !1;
  const e = t.output;
  return typeof e == "object" && e !== null && "success" in e && e.success === !0;
};
export {
  r as isSucceededCompleteWorkspaceSetupToolPart
};

//# sourceMappingURL=is-succeeded-complete-workspace-setup-tool-part.util.js.map