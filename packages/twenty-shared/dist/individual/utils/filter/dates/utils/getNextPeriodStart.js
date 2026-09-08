import { assertUnreachable as t } from "../../../assertUnreachable.js";
import { getPeriodStart as s } from "./getPeriodStart.js";
var c = 1, o = (r, d, a) => {
  switch (d) {
    case "DAY":
      return s(r, "DAY").add({ days: 1 });
    case "WEEK":
      return s(r, "WEEK", a).add({ weeks: 1 });
    case "MONTH":
      return s(r, "MONTH", a).add({ months: 1 });
    case "QUARTER":
      return s(r, "QUARTER", a).add({ months: 3 });
    case "YEAR":
      return s(r, "YEAR", a).add({ years: 1 });
    case "SECOND":
      return s(r, "SECOND").add({ seconds: 1 });
    case "MINUTE":
      return s(r, "MINUTE").add({ minutes: 1 });
    case "HOUR":
      return s(r, "HOUR").add({ hours: 1 });
    default:
      return t(d);
  }
};
export {
  c as FIRST_DAY_OF_WEEK_ISO_8601_MONDAY,
  o as getNextPeriodStart
};

//# sourceMappingURL=getNextPeriodStart.js.map