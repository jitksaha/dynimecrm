import { isDefined as L } from "../utils/validation/isDefined.js";
import { capitalize as c } from "../utils/strings/capitalize.js";
var r = [
  "objectLabel",
  "objectLabelSingular",
  "objectLabelPlural",
  "objectIcon"
], A = [
  "objectLabelSingular",
  "objectLabelPlural",
  "objectIcon"
], t = (e) => `{${e}}`, j = Object.fromEntries(r.map((e) => [e, t(e)])), l = (e) => L(e) ? c(e) : void 0, d = ({ label: e, labelSingular: a, labelPlural: b, icon: o }) => ({
  objectLabel: l(e),
  objectLabelSingular: l(a),
  objectLabelPlural: l(b),
  objectIcon: o ?? void 0
}), _ = (e) => A.some((a) => e.includes(t(a)));
export {
  r as METADATA_LABEL_PLACEHOLDER_NAMES,
  j as METADATA_LABEL_PLACEHOLDER_PASS_THROUGH,
  A as OBJECT_METADATA_LABEL_PLACEHOLDER_NAMES,
  d as buildObjectMetadataLabelPlaceholderValues,
  t as getMetadataLabelPlaceholder,
  _ as hasObjectMetadataLabelPlaceholder
};

//# sourceMappingURL=metadata-label-placeholder.js.map