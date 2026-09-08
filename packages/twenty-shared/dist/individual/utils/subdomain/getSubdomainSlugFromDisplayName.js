import { isDefined as o } from "../validation/isDefined.js";
import { slugify as t } from "transliteration";
var a = 1, i = 30, s = (r) => {
  if (!o(r)) return;
  const e = t(r, {
    trim: !0,
    separator: "-",
    allowedChars: "a-zA-Z0-9"
  }).slice(0, i).replace(/-+$/g, "");
  return e.length >= a ? e : void 0;
};
export {
  s as getSubdomainSlugFromDisplayName
};

//# sourceMappingURL=getSubdomainSlugFromDisplayName.js.map