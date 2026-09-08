import { FirstDayOfTheWeek as r } from "../../../../types/FirstDayOfTheWeek.js";
import { assertUnreachable as t } from "../../../assertUnreachable.js";
var u = (e) => {
  switch (e) {
    case r.MONDAY:
      return 1;
    case r.SATURDAY:
      return 6;
    case r.SUNDAY:
      return 7;
    default:
      return t(e);
  }
};
export {
  u as getFirstDayOfTheWeekAsISONumber
};

//# sourceMappingURL=getFirstDayOfTheWeekAsISONumber.js.map