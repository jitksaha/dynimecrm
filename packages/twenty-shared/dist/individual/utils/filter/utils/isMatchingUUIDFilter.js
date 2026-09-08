var e = ({ uuidFilter: n, value: s }) => {
  switch (!0) {
    case n.eq !== void 0:
      return s === n.eq;
    case n.neq !== void 0:
      return s !== n.neq;
    case n.gt !== void 0:
      return s > n.gt;
    case n.gte !== void 0:
      return s >= n.gte;
    case n.lt !== void 0:
      return s < n.lt;
    case n.lte !== void 0:
      return s <= n.lte;
    case n.in !== void 0:
      return n.in.includes(s);
    case n.is !== void 0:
      return n.is === "NULL" ? s === null : s !== null;
    default:
      throw new Error(`Unexpected value for UUID filter: ${JSON.stringify(n)}`);
  }
};
export {
  e as isMatchingUUIDFilter
};

//# sourceMappingURL=isMatchingUUIDFilter.js.map