import { isDefined as u } from "../../validation/isDefined.js";
import { isAfter as f, isBefore as e, isEqual as i, parseISO as s } from "date-fns";
var D = ({ dateFilter: n, value: r }) => {
  if (!u(r)) return n.is === "NULL";
  switch (!0) {
    case n.eq !== void 0:
      return i(s(r), s(n.eq));
    case n.neq !== void 0:
      return !i(s(r), s(n.neq));
    case n.in !== void 0:
      return n.in.includes(r);
    case n.is !== void 0:
      return n.is === "NULL" ? r === null : r !== null;
    case n.gt !== void 0:
      return f(s(r), s(n.gt));
    case n.gte !== void 0: {
      const o = s(r), c = s(n.gte);
      return f(o, c) || i(o, c);
    }
    case n.lt !== void 0:
      return e(s(r), s(n.lt));
    case n.lte !== void 0: {
      const o = s(r), c = s(n.lte);
      return e(o, c) || i(o, c);
    }
    default:
      throw new Error(`Unexpected value for string filter : ${JSON.stringify(n)}`);
  }
};
export {
  D as isMatchingDateFilter
};

//# sourceMappingURL=isMatchingDateFilter.js.map