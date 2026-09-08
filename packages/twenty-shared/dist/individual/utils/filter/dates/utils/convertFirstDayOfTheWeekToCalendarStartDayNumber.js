import { FirstDayOfTheWeek as r } from "../../../../types/FirstDayOfTheWeek.js";
import { CalendarStartDay as e } from "../../../../constants/CalendarStartDay.js";
var A = (a) => {
  switch (a) {
    case r.MONDAY:
      return e.MONDAY;
    case r.SATURDAY:
      return e.SATURDAY;
    case r.SUNDAY:
      return e.SUNDAY;
  }
};
export {
  A as convertFirstDayOfTheWeekToCalendarStartDayNumber
};

//# sourceMappingURL=convertFirstDayOfTheWeekToCalendarStartDayNumber.js.map