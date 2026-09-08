import "../constants/identifier-max-char-length.constant.js";
import { computeMetadataNameFromLabel as t } from "./compute-metadata-name-from-label.util.js";
var c = ({ labelSingular: m, labelPlural: l, applyCustomSuffix: a = !0 }) => {
  const r = t({
    label: m,
    applyCustomSuffix: a
  });
  let e = t({
    label: l,
    applyCustomSuffix: a
  });
  return e !== "" && e === r && (e = (e + "s").slice(0, 63)), {
    nameSingular: r,
    namePlural: e
  };
};
export {
  c as computeMetadataNamesFromLabelsOrThrow
};

//# sourceMappingURL=compute-metadata-names-from-labels-or-throw.util.js.map