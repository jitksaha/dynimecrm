import { isDefined as E } from "../../../validation/isDefined.js";
import { isRecordFilterOperandExpectingValue as S } from "../../isRecordFilterOperandExpectingValue.js";
import { COMPOSITE_SUB_FIELD_VALUE_SCHEMAS as o, FILTER_VALUE_SCHEMAS_MAP as _ } from "./filterValueSchemasMap.js";
var n = ({ filterType: e, operand: r, subFieldName: t }) => {
  if (!S(r)) return;
  const i = o[e];
  return E(t) && E(i?.[t]) ? i[t][r] : _[e][r];
};
export {
  n as getFilterValueSchema
};

//# sourceMappingURL=getFilterValueSchema.js.map