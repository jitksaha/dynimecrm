import { isDefined as m } from "../../../validation/isDefined.js";
import { addUnitToZonedDateTime as a } from "./addUnitToZonedDateTime.js";
import { getPeriodStart as d } from "./getPeriodStart.js";
import { getNextPeriodStart as e } from "./getNextPeriodStart.js";
import { subUnitFromZonedDateTime as f } from "./subUnitFromZonedDateTime.js";
var h = (o, i) => {
  const { direction: u, amount: s, unit: r, firstDayOfTheWeek: n } = o;
  switch (u) {
    case "NEXT": {
      if (!m(s)) throw new Error("Amount is required");
      const t = e(i, r, n);
      return {
        ...o,
        start: t,
        end: a(t, r, s)
      };
    }
    case "PAST": {
      if (!m(s)) throw new Error("Amount is required");
      const t = d(i, r, n);
      return {
        ...o,
        start: f(t, r, s),
        end: t
      };
    }
    case "THIS":
      return {
        ...o,
        start: d(i, r, n),
        end: e(i, r, n)
      };
  }
};
export {
  h as resolveRelativeDateTimeFilter
};

//# sourceMappingURL=resolveRelativeDateTimeFilter.js.map