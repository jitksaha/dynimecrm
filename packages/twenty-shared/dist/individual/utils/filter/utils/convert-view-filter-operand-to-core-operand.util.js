import { ViewFilterOperand as _ } from "../../../types/ViewFilterOperand.js";
import { ViewFilterOperandDeprecated as I } from "../../../types/ViewFilterOperandDeprecated.js";
var E = {
  [I.Is]: _.IS,
  [I.IsNotNull]: _.IS_NOT_NULL,
  [I.IsNot]: _.IS_NOT,
  [I.LessThanOrEqual]: _.LESS_THAN_OR_EQUAL,
  [I.GreaterThanOrEqual]: _.GREATER_THAN_OR_EQUAL,
  [I.IsBefore]: _.IS_BEFORE,
  [I.IsAfter]: _.IS_AFTER,
  [I.Contains]: _.CONTAINS,
  [I.DoesNotContain]: _.DOES_NOT_CONTAIN,
  [I.IsEmpty]: _.IS_EMPTY,
  [I.IsNotEmpty]: _.IS_NOT_EMPTY,
  [I.IsRelative]: _.IS_RELATIVE,
  [I.IsInPast]: _.IS_IN_PAST,
  [I.IsInFuture]: _.IS_IN_FUTURE,
  [I.IsToday]: _.IS_TODAY,
  [_.IS]: _.IS,
  [_.IS_NOT_NULL]: _.IS_NOT_NULL,
  [_.IS_NOT]: _.IS_NOT,
  [_.LESS_THAN_OR_EQUAL]: _.LESS_THAN_OR_EQUAL,
  [_.GREATER_THAN_OR_EQUAL]: _.GREATER_THAN_OR_EQUAL,
  [_.IS_BEFORE]: _.IS_BEFORE,
  [_.IS_AFTER]: _.IS_AFTER,
  [_.CONTAINS]: _.CONTAINS,
  [_.DOES_NOT_CONTAIN]: _.DOES_NOT_CONTAIN,
  [_.IS_EMPTY]: _.IS_EMPTY,
  [_.IS_NOT_EMPTY]: _.IS_NOT_EMPTY,
  [_.IS_RELATIVE]: _.IS_RELATIVE,
  [_.IS_IN_PAST]: _.IS_IN_PAST,
  [_.IS_IN_FUTURE]: _.IS_IN_FUTURE,
  [_.IS_TODAY]: _.IS_TODAY,
  [_.VECTOR_SEARCH]: _.VECTOR_SEARCH
}, O = (T) => E[T];
export {
  O as convertViewFilterOperandToCoreOperand
};

//# sourceMappingURL=convert-view-filter-operand-to-core-operand.util.js.map