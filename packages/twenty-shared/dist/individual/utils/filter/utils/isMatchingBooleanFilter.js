var i = ({ booleanFilter: r, value: e }) => {
  if (r.eq !== void 0) return e === r.eq;
  if (r.is !== void 0) return r.is === "NULL" ? e === null : e !== null;
  throw new Error(`Unexpected value for string filter : ${JSON.stringify(r)}`);
};
export {
  i as isMatchingBooleanFilter
};

//# sourceMappingURL=isMatchingBooleanFilter.js.map