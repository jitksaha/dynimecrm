var i = ({ arrayFilter: r, value: e }) => {
  switch (!0) {
    case r.is !== void 0:
      return r.is === "NULL" ? e === null : e !== null;
    case r.isEmptyArray !== void 0:
      return Array.isArray(e) && e.length === 0;
    case r.containsIlike !== void 0: {
      const s = r.containsIlike.toLowerCase();
      return Array.isArray(e) && e.some((n) => n.toLowerCase().includes(s));
    }
    default:
      throw new Error(`Unexpected value for array filter: ${JSON.stringify(r)}`);
  }
};
export {
  i as isMatchingArrayFilter
};

//# sourceMappingURL=isMatchingArrayFilter.js.map