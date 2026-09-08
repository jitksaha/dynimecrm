import { compareSelectOptionValues as u } from "./compareSelectOptionValues.js";
var i = ({ selectFilter: n, value: o, options: a }) => {
  switch (!0) {
    case n.in !== void 0:
      return o !== null && n.in.includes(o);
    case n.is !== void 0:
      return n.is === "NULL" ? o === null : o !== null;
    case n.eq !== void 0:
      return o === n.eq;
    case n.neq !== void 0:
      return o !== null && o !== n.neq;
    case n.gt !== void 0: {
      const r = u({
        value: o,
        comparisonValue: n.gt,
        options: a
      });
      return r !== null && r > 0;
    }
    case n.gte !== void 0: {
      const r = u({
        value: o,
        comparisonValue: n.gte,
        options: a
      });
      return r !== null && r >= 0;
    }
    case n.lt !== void 0: {
      const r = u({
        value: o,
        comparisonValue: n.lt,
        options: a
      });
      return r !== null && r < 0;
    }
    case n.lte !== void 0: {
      const r = u({
        value: o,
        comparisonValue: n.lte,
        options: a
      });
      return r !== null && r <= 0;
    }
    default:
      throw new Error(`Unexpected value for select filter : ${JSON.stringify(n)}`);
  }
};
export {
  i as isMatchingSelectFilter
};

//# sourceMappingURL=isMatchingSelectFilter.js.map