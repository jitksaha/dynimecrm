import { ViewFilterOperand as e } from "../../types/ViewFilterOperand.js";
var t = (r) => {
  switch (r) {
    case e.IS_NOT_NULL:
    case e.IS_EMPTY:
    case e.IS_NOT_EMPTY:
    case e.IS_IN_PAST:
    case e.IS_IN_FUTURE:
    case e.IS_TODAY:
      return !1;
    default:
      return !0;
  }
};
export {
  t as isRecordFilterOperandExpectingValue
};

//# sourceMappingURL=isRecordFilterOperandExpectingValue.js.map