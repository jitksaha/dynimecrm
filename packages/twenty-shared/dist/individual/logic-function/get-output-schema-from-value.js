import { isDefined as i } from "../utils/validation/isDefined.js";
import { isObject as o } from "@sniptt/guards";
var f = (r) => !i(r) || r === null ? "unknown" : typeof r == "string" ? "string" : typeof r == "number" ? "number" : typeof r == "boolean" ? "boolean" : Array.isArray(r) ? "array" : "unknown", p = (r) => r ? Object.entries(r).reduce((n, [t, e]) => (o(e) && !Array.isArray(e) ? n[t] = {
  isLeaf: !1,
  type: "object",
  label: t,
  value: p(e)
} : n[t] = {
  isLeaf: !0,
  value: e,
  type: f(e),
  label: t
}, n), {}) : {};
export {
  p as getOutputSchemaFromValue
};

//# sourceMappingURL=get-output-schema-from-value.js.map