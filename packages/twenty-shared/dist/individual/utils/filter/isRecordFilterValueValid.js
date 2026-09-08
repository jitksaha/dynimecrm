import { isDefined as a } from "../validation/isDefined.js";
import { isRecordFilterOperandExpectingValue as i } from "./isRecordFilterOperandExpectingValue.js";
var n = (e) => i(e.operand) ? a(e.value) && e.value !== "" && e.value !== "[]" : !0;
export {
  n as isRecordFilterValueValid
};

//# sourceMappingURL=isRecordFilterValueValid.js.map