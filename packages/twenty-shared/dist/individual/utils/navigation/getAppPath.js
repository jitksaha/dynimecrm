import { isDefined as e } from "../validation/isDefined.js";
import p from "qs";
import { generatePath as s } from "react-router-dom";
var l = (r, i, f) => {
  let t = r;
  if (e(i) && (t = s(r, i)), e(f)) {
    const o = Object.fromEntries(Object.entries(f).filter(([c, m]) => e(m))), n = p.stringify(o);
    n !== "" && (t += `?${n}`);
  }
  return t;
};
export {
  l as getAppPath
};

//# sourceMappingURL=getAppPath.js.map