import { isDefined as e } from "../../../validation/isDefined.js";
import { assertUnreachable as a } from "../../../assertUnreachable.js";
import { getFirstDayOfTheWeekAsISONumber as c } from "./getFirstDayOfTheWeekAsISONumber.js";
import "./getNextPeriodStart.js";
var y = (r, s, o) => {
  switch (s) {
    case "DAY":
      return r.startOfDay();
    case "WEEK": {
      const t = e(o) ? c(o) : 1, n = (r.dayOfWeek - t + 7) % 7;
      return r.startOfDay().subtract({ days: n });
    }
    case "QUARTER": {
      const t = Math.floor((r.month - 1) / 3);
      return r.startOfDay().with({
        day: 1,
        month: t * 3 + 1
      });
    }
    case "MONTH":
      return r.startOfDay().with({ day: 1 });
    case "YEAR":
      return r.startOfDay().with({
        day: 1,
        month: 1
      });
    case "SECOND":
      return r.with({
        nanosecond: 0,
        microsecond: 0,
        millisecond: 0
      });
    case "MINUTE":
      return r.with({
        second: 0,
        nanosecond: 0,
        microsecond: 0,
        millisecond: 0
      });
    case "HOUR":
      return r.with({
        minute: 0,
        second: 0,
        nanosecond: 0,
        microsecond: 0,
        millisecond: 0
      });
    default:
      return a(s);
  }
};
export {
  y as getPeriodStart
};

//# sourceMappingURL=getPeriodStart.js.map