import { isDefined as a } from "../../../validation/isDefined.js";
import { addUnitToZonedDateTime as u } from "./addUnitToZonedDateTime.js";
import { getPeriodStart as P } from "./getPeriodStart.js";
import { getNextPeriodStart as d } from "./getNextPeriodStart.js";
import { subUnitFromZonedDateTime as S } from "./subUnitFromZonedDateTime.js";
var h = (n, i) => {
  const { direction: f, amount: s, unit: r, firstDayOfTheWeek: e } = n;
  switch (f) {
    case "NEXT": {
      if (!a(s)) throw new Error("Amount is required");
      const t = d(i, r, e), o = u(t, r, s);
      return {
        ...n,
        start: t.toPlainDate().toString(),
        end: o.toPlainDate().toString()
      };
    }
    case "PAST": {
      if (!a(s)) throw new Error("Amount is required");
      const t = P(i, r, e), o = S(t, r, s);
      return {
        ...n,
        start: o.toPlainDate().toString(),
        end: t.toPlainDate().toString()
      };
    }
    case "THIS": {
      const t = P(i, r, e), o = d(i, r, e), m = t?.toPlainDate().toString(), c = o?.toPlainDate().toString();
      return {
        ...n,
        start: m,
        end: c
      };
    }
  }
};
export {
  h as resolveRelativeDateFilter
};

//# sourceMappingURL=resolveRelativeDateFilter.js.map