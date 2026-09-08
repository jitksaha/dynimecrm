import d from "lodash.escaperegexp";
var a = ({ stringFilter: e, value: c }) => {
  switch (!0) {
    case e.eq !== void 0:
      return c === e.eq;
    case e.neq !== void 0:
      return c !== e.neq;
    case e.gt !== void 0:
      return c > e.gt;
    case e.gte !== void 0:
      return c >= e.gte;
    case e.lt !== void 0:
      return c < e.lt;
    case e.lte !== void 0:
      return c <= e.lte;
    case e.like !== void 0: {
      const o = d(e.like).replace(/%/g, ".*");
      return new RegExp(`^${o}$`).test(c);
    }
    case e.ilike !== void 0: {
      const o = d(e.ilike).replace(/%/g, ".*");
      return new RegExp(`^${o}$`, "i").test(c);
    }
    case e.in !== void 0:
      return e.in.includes(c);
    case e.is !== void 0:
      return e.is === "NULL" ? c === null : c !== null;
    case e.regex !== void 0: {
      const o = e.regex;
      return new RegExp(o).test(c);
    }
    case e.iregex !== void 0: {
      const o = e.iregex;
      return new RegExp(o, "i").test(c);
    }
    case e.startsWith !== void 0:
      return c.startsWith(e.startsWith);
    default:
      throw new Error(`Unexpected value for string filter : ${JSON.stringify(e)}`);
  }
};
export {
  a as isMatchingStringFilter
};

//# sourceMappingURL=isMatchingStringFilter.js.map