import { trimAndRemoveDuplicatedWhitespacesFromString as d } from "./trim-and-remove-duplicated-whitespaces-from-string.js";
var p = (o, s, f = 10) => {
  const n = (r, i) => {
    if (r !== void 0) {
      if (r === null) return null;
      if (i >= f) return r;
      if (Array.isArray(r)) return r.map((t) => n(t, i));
      if (typeof r == "object") {
        const t = r;
        return Object.keys(t).reduce((c, e) => ({
          ...c,
          [e]: n(t[e], i + 1)
        }), {});
      }
      return typeof r == "string" ? d(r) : r;
    }
  };
  return s.reduce((r, i) => {
    const t = n(o[i], 0);
    return t === void 0 ? r : {
      ...r,
      [i]: t
    };
  }, {});
};
export {
  p as extractAndSanitizeObjectStringFields
};

//# sourceMappingURL=extractAndSanitizeObjectStringFields.js.map