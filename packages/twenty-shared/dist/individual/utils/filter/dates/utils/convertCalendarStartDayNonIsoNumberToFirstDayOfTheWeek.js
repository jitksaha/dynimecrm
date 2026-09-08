import { FirstDayOfTheWeek as e } from "../../../../types/FirstDayOfTheWeek.js";
import { CalendarStartDay as r } from "../../../../constants/CalendarStartDay.js";
import { assertUnreachable as o } from "../../../assertUnreachable.js";
var A = (t, a) => {
  switch (t) {
    case r.MONDAY:
      return e.MONDAY;
    case r.SATURDAY:
      return e.SATURDAY;
    case r.SUNDAY:
      return e.SUNDAY;
    case r.SYSTEM:
      return a;
    default:
      return o(t);
  }
};
export {
  A as convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek
};

//# sourceMappingURL=convertCalendarStartDayNonIsoNumberToFirstDayOfTheWeek.js.map