import { isDefined as p } from "../validation/isDefined.js";
import { isObject as s, isString as i } from "@sniptt/guards";
var c = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype"
]), u = (o, e) => {
  if (!i(e)) return;
  const n = e.split(".");
  let r = o;
  for (const t of n) {
    if (!p(r) || !s(r) || c.has(t) || !Object.prototype.hasOwnProperty.call(r, t)) return;
    r = r[t];
  }
  return r;
};
export {
  u as safeGetNestedProperty
};

//# sourceMappingURL=safeGetNestedProperty.js.map