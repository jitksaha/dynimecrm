import { isDefined as e } from "../validation/isDefined.js";
import { NON_ISO_DATE_FORMATS as s } from "./dateInputFormats.js";
import { turnJSDateToPlainDate as m } from "./turnJSDateToPlainDate.js";
import { Temporal as n } from "temporal-polyfill";
import { isValid as f, parse as i } from "date-fns";
var p = (t) => {
  try {
    return n.Instant.from(t);
  } catch {
    try {
      return n.PlainDateTime.from(t).toZonedDateTime("UTC").toInstant();
    } catch {
      return null;
    }
  }
}, l = (t) => {
  const r = p(t);
  if (e(r)) return r;
  for (const a of s) {
    const o = i(t, a, /* @__PURE__ */ new Date());
    if (f(o)) return m(o).toZonedDateTime("UTC").toInstant();
  }
  throw new Error(`Cannot parse date-time string as Instant: "${t}"`);
};
export {
  l as parseToInstantOrThrow
};

//# sourceMappingURL=parseToInstantOrThrow.js.map