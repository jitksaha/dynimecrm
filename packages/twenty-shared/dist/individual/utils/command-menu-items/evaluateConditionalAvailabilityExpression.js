import { conditionalAvailabilityParser as a } from "./conditionalAvailabilityParser.js";
import { isNonEmptyString as i } from "@sniptt/guards";
var l = (r, t) => {
  if (!i(r)) return !0;
  try {
    return a.parse(r).evaluate(t) === !0;
  } catch {
    return !1;
  }
};
export {
  l as evaluateConditionalAvailabilityExpression
};

//# sourceMappingURL=evaluateConditionalAvailabilityExpression.js.map