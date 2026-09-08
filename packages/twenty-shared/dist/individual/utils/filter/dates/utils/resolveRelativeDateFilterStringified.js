import { isDefined as o } from "../../../validation/isDefined.js";
import { relativeDateFilterStringifiedSchema as a } from "./relativeDateFilterStringifiedSchema.js";
import { resolveRelativeDateFilter as m } from "./resolveRelativeDateFilter.js";
import { isNonEmptyString as l } from "@sniptt/guards";
import { Temporal as i } from "temporal-polyfill";
var v = (t) => {
  if (!l(t)) return null;
  const r = a.safeParse(t);
  if (!r.success) return null;
  const e = r.data;
  return m(e, o(e.timezone) ? i.Now.zonedDateTimeISO(e.timezone) : i.Now.zonedDateTimeISO());
};
export {
  v as resolveRelativeDateFilterStringified
};

//# sourceMappingURL=resolveRelativeDateFilterStringified.js.map