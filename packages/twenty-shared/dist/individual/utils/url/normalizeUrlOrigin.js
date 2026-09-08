import { isDefined as i } from "../validation/isDefined.js";
import { getURLSafely as n } from "../getURLSafely.js";
var a = (e) => {
  const r = n(e);
  return i(r) ? (r.origin + r.pathname + r.search + r.hash).replace(/\/$/, "") : e;
};
export {
  a as normalizeUrlOrigin
};

//# sourceMappingURL=normalizeUrlOrigin.js.map