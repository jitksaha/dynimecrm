import { isEmptinessOperand as i } from "./isEmptinessOperand.js";
import { getFilterTypeFromFieldType as s } from "./utils/getFilterTypeFromFieldType.js";
var m = ({ recordFilterOperand: e, correspondingFieldMetadataItem: t }) => {
  if (!i(e)) return !1;
  const r = ["BOOLEAN", "TS_VECTOR"], p = s(t.type);
  return !r.includes(p);
};
export {
  m as checkIfShouldComputeEmptinessFilter
};

//# sourceMappingURL=checkIfShouldComputeEmptinessFilter.js.map