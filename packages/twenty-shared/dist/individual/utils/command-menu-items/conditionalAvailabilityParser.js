import { isDefined as t } from "../validation/isDefined.js";
import { safeGetNestedProperty as c } from "./safeGetNestedProperty.js";
import { isNonEmptyArray as y, isNonEmptyString as a } from "@sniptt/guards";
import { Parser as l } from "expr-eval-fork";
var o = (e, n) => (s, u) => y(s) ? s[e]((f) => n(c(f, u))) : !1, i = (e, n) => (s, u, f) => y(s) ? s[e]((m) => n(c(m, u), f)) : !1, r = new l();
r.functions.isDefined = (e) => t(e);
r.functions.isNonEmptyString = (e) => a(e);
r.functions.includes = (e, n) => Array.isArray(e) && e.includes(n);
r.functions.arrayLength = (e) => Array.isArray(e) ? e.length : 0;
r.functions.every = o("every", Boolean);
r.functions.everyDefined = o("every", t);
r.functions.some = o("some", Boolean);
r.functions.someDefined = o("some", t);
r.functions.someNonEmptyString = o("some", a);
r.functions.none = o("every", (e) => !e);
r.functions.noneDefined = o("every", (e) => !t(e));
r.functions.everyEquals = i("every", (e, n) => e === n);
r.functions.someEquals = i("some", (e, n) => e === n);
r.functions.noneEquals = i("every", (e, n) => e !== n);
r.functions.includesEvery = i("every", (e, n) => Array.isArray(e) && e.includes(n));
r.functions.includesSome = i("some", (e, n) => Array.isArray(e) && e.includes(n));
r.functions.includesNone = i("every", (e, n) => Array.isArray(e) && !e.includes(n));
export {
  r as conditionalAvailabilityParser
};

//# sourceMappingURL=conditionalAvailabilityParser.js.map