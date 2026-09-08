import { ViewFilterOperand as e } from "../../../../types/ViewFilterOperand.js";
import { resolveRelativeDateFilterStringified as t } from "./resolveRelativeDateFilterStringified.js";
var o = (r) => r.value ? r.operand === e.IS_RELATIVE ? t(r.value) : r.value : null;
export {
  o as resolveDateFilter
};

//# sourceMappingURL=resolveDateFilter.js.map