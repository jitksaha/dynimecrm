import { ViewFilterOperand as r } from "../../../../types/ViewFilterOperand.js";
import { resolveRelativeDateTimeFilterStringified as t } from "./resolveRelativeDateTimeFilterStringified.js";
var l = (e) => e.value ? e.operand === r.IS_RELATIVE ? t(e.value) : e.value : null;
export {
  l as resolveDateTimeFilter
};

//# sourceMappingURL=resolveDateTimeFilter.js.map