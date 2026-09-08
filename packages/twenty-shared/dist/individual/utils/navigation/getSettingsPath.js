import { isDefined as e } from "../validation/isDefined.js";
import { AppPath as m } from "../../types/AppPath.js";
import g from "qs";
import { generatePath as $ } from "react-router-dom";
var b = (i, r, f, n) => {
  let t = `/${m.Settings}/${i}`;
  if (e(r) && (t = $(`/${m.Settings}/${i}`, r)), e(f)) {
    const p = Object.fromEntries(Object.entries(f).filter(([c, s]) => e(s))), o = g.stringify(p);
    o !== "" && (t += `?${o}`);
  }
  return e(n) && (t += `#${n.replace(/^#/, "")}`), t;
};
export {
  b as getSettingsPath
};

//# sourceMappingURL=getSettingsPath.js.map