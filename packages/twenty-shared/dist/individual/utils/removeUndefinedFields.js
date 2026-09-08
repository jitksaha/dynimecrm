import { isUndefined as o } from "@sniptt/guards";
var i = (e) => e === void 0 || e === null || typeof e != "object" ? e : Array.isArray(e) ? e.map((r) => i(r)).filter((r) => !o(r)) : Object.entries(e).reduce((r, [f, t]) => {
  if (o(t)) return r;
  if (t === null || t instanceof Date) return {
    ...r,
    [f]: t
  };
  if (typeof t == "object") {
    const n = i(t);
    return !o(n) && Object.keys(n).length > 0 ? {
      ...r,
      [f]: n
    } : r;
  }
  return {
    ...r,
    [f]: t
  };
}, {});
export {
  i as removeUndefinedFields
};

//# sourceMappingURL=removeUndefinedFields.js.map