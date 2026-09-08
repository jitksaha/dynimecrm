import { isNonEmptyString as o } from "@sniptt/guards";
var t = "(Copy)", p = "(copy)", n = (r) => !o(r) || r.toLowerCase().endsWith(p) ? r : `${r} ${t}`;
export {
  n as appendCopySuffix
};

//# sourceMappingURL=appendCopySuffix.js.map