import { assertUnreachable as a } from "../../../assertUnreachable.js";
var e = (r, d, s) => {
  switch (d) {
    case "DAY":
      return r.add({ days: s });
    case "WEEK":
      return r.add({ weeks: s });
    case "QUARTER":
      return r.add({ months: s * 3 });
    case "MONTH":
      return r.add({ months: s });
    case "YEAR":
      return r.add({ years: s });
    case "SECOND":
      return r.add({ seconds: s });
    case "MINUTE":
      return r.add({ minutes: s });
    case "HOUR":
      return r.add({ hours: s });
    default:
      return a(d);
  }
};
export {
  e as addUnitToZonedDateTime
};

//# sourceMappingURL=addUnitToZonedDateTime.js.map