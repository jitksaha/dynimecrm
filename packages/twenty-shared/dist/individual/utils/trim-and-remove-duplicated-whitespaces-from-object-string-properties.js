import { trimAndRemoveDuplicatedWhitespacesFromString as c } from "./trim-and-remove-duplicated-whitespaces-from-string.js";
var p = (e, n, o) => n.reduce((t, i) => {
  const r = e[i];
  return r === void 0 || typeof r != "string" || r === null ? t : {
    ...t,
    [i]: c(r)
  };
}, o ? {} : e);
export {
  p as trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties
};

//# sourceMappingURL=trim-and-remove-duplicated-whitespaces-from-object-string-properties.js.map