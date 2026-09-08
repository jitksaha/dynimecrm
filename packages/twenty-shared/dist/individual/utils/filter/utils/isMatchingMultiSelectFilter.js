var i = ({ multiSelectFilter: r, value: n }) => {
  switch (!0) {
    case r.containsAny !== void 0:
      return Array.isArray(n) && r.containsAny.some((s) => n.includes(s));
    case r.isEmptyArray !== void 0:
      return Array.isArray(n) && n.length === 0;
    case r.is !== void 0:
      return r.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(`Unexpected value for multi-select filter: ${JSON.stringify(r)}`);
  }
};
export {
  i as isMatchingMultiSelectFilter
};

//# sourceMappingURL=isMatchingMultiSelectFilter.js.map