import { addCustomSuffixIfIsReserved as m } from "./add-custom-suffix-if-reserved.util.js";
import f from "lodash.camelcase";
import { slugify as i } from "transliteration";
var u = ({ label: r, applyCustomSuffix: a = !0 }) => {
  if (!r) return "";
  const t = /^\d/.test(r) ? `n${r}` : r;
  if (t === "") return "";
  const e = i(t, {
    trim: !0,
    separator: "_",
    allowedChars: "a-zA-Z0-9"
  });
  if (e === "") throw new Error(`Invalid label: "${r}"`);
  const o = f(e);
  return a ? m(o) : o;
};
export {
  u as computeMetadataNameFromLabel
};

//# sourceMappingURL=compute-metadata-name-from-label.util.js.map