import { assertUnreachable as c } from "../../../assertUnreachable.js";
var a = (r, t, s) => {
  switch (t) {
    case "DAY":
      return r.subtract({ days: s });
    case "WEEK":
      return r.subtract({ weeks: s });
    case "QUARTER":
      return r.subtract({ months: s * 3 });
    case "MONTH":
      return r.subtract({ months: s });
    case "YEAR":
      return r.subtract({ years: s });
    case "SECOND":
      return r.subtract({ seconds: s });
    case "MINUTE":
      return r.subtract({ minutes: s });
    case "HOUR":
      return r.subtract({ hours: s });
    default:
      return c(t);
  }
};
export {
  a as subUnitFromZonedDateTime
};

//# sourceMappingURL=subUnitFromZonedDateTime.js.map