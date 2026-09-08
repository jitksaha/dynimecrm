import { ViewFilterOperand as r } from "../../../types/ViewFilterOperand.js";
import { COMPOSITE_FIELD_FILTER_OPERANDS_MAP as t } from "./compositeFieldFilterOperandsMap.js";
import { FILTER_OPERANDS_MAP as E } from "./filterOperandsMap.js";
var R = [
  r.IS,
  r.IS_NOT,
  r.IS_EMPTY,
  r.IS_NOT_EMPTY
], _ = ({ filterType: e, subFieldName: o }) => e === "CURRENCY" ? o === "currencyCode" ? t.CURRENCY.currencyCode : t.CURRENCY.amountMicros : e === "ACTOR" && (o === "source" || o === "workspaceMemberId") ? R : E[e];
export {
  _ as getFilterOperandsForFilterableFieldType
};

//# sourceMappingURL=getFilterOperandsForFilterableFieldType.js.map