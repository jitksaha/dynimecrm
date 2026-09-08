var a = ({ tsVectorFilter: e, value: r }) => {
  if (r === void 0) return !0;
  if (!0 === (e.search !== void 0)) {
    const t = e.search.toLowerCase(), o = r.toLowerCase();
    return t.split(/\s+/).filter(Boolean).every((s) => o.includes(s));
  } else
    throw new Error(`Unexpected value for ts_vector filter : ${JSON.stringify(e)}`);
};
export {
  a as isMatchingTSVectorFilter
};

//# sourceMappingURL=isMatchingTSVectorFilter.js.map