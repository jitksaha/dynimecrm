import { addDays as e, addHours as a, addMinutes as E, addMonths as c, addSeconds as n, addWeeks as D, addYears as M } from "date-fns";
var U = (r, s, d) => {
  switch (d) {
    case "SECOND":
      return n(r, s);
    case "MINUTE":
      return E(r, s);
    case "HOUR":
      return a(r, s);
    case "DAY":
      return e(r, s);
    case "WEEK":
      return D(r, s);
    case "MONTH":
      return c(r, s);
    case "QUARTER":
      return c(r, s * 3);
    case "YEAR":
      return M(r, s);
  }
};
export {
  U as addUnitToDateTime
};

//# sourceMappingURL=addUnitToDateTime.js.map