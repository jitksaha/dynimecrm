import { FirstDayOfTheWeek as r } from "../../../../types/FirstDayOfTheWeek.js";
import { assertUnreachable as t } from "../../../assertUnreachable.js";
var o = (e) => {
  switch (e) {
    case r.MONDAY:
      return 1;
    case r.SATURDAY:
      return 6;
    case r.SUNDAY:
      return 0;
    default:
      return t(e);
  }
};
export {
  o as getFirstDayOfTheWeekAsANumberForDateFNS
};

//# sourceMappingURL=getFirstDayOfTheWeekAsANumberForDateFNS.js.map