import { isDefined as l } from "../../validation/isDefined.js";
var p = ({ value: n, comparisonValue: s, options: o }) => {
  if (!l(n) || !l(o)) return null;
  const r = [...o].sort((e, u) => e.position - u.position).map((e) => e.value), i = r.indexOf(n), t = r.indexOf(s);
  return i === -1 || t === -1 ? null : i - t;
};
export {
  p as compareSelectOptionValues
};

//# sourceMappingURL=compareSelectOptionValues.js.map