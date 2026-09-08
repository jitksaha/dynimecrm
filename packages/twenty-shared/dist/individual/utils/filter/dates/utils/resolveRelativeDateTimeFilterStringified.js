import { isDefined as o } from "../../../validation/isDefined.js";
import { relativeDateFilterStringifiedSchema as a } from "./relativeDateFilterStringifiedSchema.js";
import { resolveRelativeDateTimeFilter as l } from "./resolveRelativeDateTimeFilter.js";
import { isNonEmptyString as m } from "@sniptt/guards";
import { Temporal as i } from "temporal-polyfill";
var d = (t) => {
  if (!m(t)) return null;
  const r = a.safeParse(t);
  if (r.success) {
    const e = r.data;
    return l(e, (o(e.timezone) ? i.Now.zonedDateTimeISO(e.timezone) : i.Now.zonedDateTimeISO()).round({ smallestUnit: "second" }));
  } else return null;
};
export {
  d as resolveRelativeDateTimeFilterStringified
};

//# sourceMappingURL=resolveRelativeDateTimeFilterStringified.js.map