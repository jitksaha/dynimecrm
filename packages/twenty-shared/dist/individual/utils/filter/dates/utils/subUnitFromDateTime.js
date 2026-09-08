import { subDays as e, subHours as b, subMinutes as E, subMonths as u, subSeconds as n, subWeeks as D, subYears as M } from "date-fns";
var U = (s, r, c) => {
  switch (c) {
    case "SECOND":
      return n(s, r);
    case "MINUTE":
      return E(s, r);
    case "HOUR":
      return b(s, r);
    case "DAY":
      return e(s, r);
    case "WEEK":
      return D(s, r);
    case "MONTH":
      return u(s, r);
    case "QUARTER":
      return u(s, r * 3);
    case "YEAR":
      return M(s, r);
  }
};
export {
  U as subUnitFromDateTime
};

//# sourceMappingURL=subUnitFromDateTime.js.map