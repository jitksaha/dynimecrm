import { compareSelectOptionValues as n } from "./compareSelectOptionValues.js";
var m = ({ ratingFilter: o, value: s, options: e }) => {
  switch (!0) {
    case o.eq !== void 0:
      return s === o.eq;
    case o.in !== void 0:
      return s !== null && o.in.includes(s);
    case o.is !== void 0:
      return o.is === "NULL" ? s === null : s !== null;
    case o.gt !== void 0: {
      const c = n({
        value: s,
        comparisonValue: o.gt,
        options: e
      });
      return c !== null && c > 0;
    }
    case o.gte !== void 0: {
      const c = n({
        value: s,
        comparisonValue: o.gte,
        options: e
      });
      return c !== null && c >= 0;
    }
    case o.lt !== void 0: {
      const c = n({
        value: s,
        comparisonValue: o.lt,
        options: e
      });
      return c !== null && c < 0;
    }
    case o.lte !== void 0: {
      const c = n({
        value: s,
        comparisonValue: o.lte,
        options: e
      });
      return c !== null && c <= 0;
    }
    default:
      throw new Error(`Unexpected value for rating filter : ${JSON.stringify(o)}`);
  }
};
export {
  m as isMatchingRatingFilter
};

//# sourceMappingURL=isMatchingRatingFilter.js.map