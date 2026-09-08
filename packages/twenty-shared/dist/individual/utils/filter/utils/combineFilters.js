var r = (t) => {
  const e = t.filter((n) => Object.keys(n).length > 0);
  return e.length === 0 ? {} : e.length === 1 ? e[0] : { and: e };
};
export {
  r as combineFilters
};

//# sourceMappingURL=combineFilters.js.map