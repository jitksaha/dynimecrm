import { ViewFilterOperand as N } from "../../../types/ViewFilterOperand.js";
var T = [N.IS_EMPTY, N.IS_NOT_EMPTY], O = [N.IS, N.IS_NOT], S = {
  TEXT: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  EMAILS: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  FULL_NAME: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  ADDRESS: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  LINKS: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  PHONES: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  CURRENCY: [
    N.GREATER_THAN_OR_EQUAL,
    N.LESS_THAN_OR_EQUAL,
    ...T
  ],
  NUMBER: [
    N.IS,
    N.IS_NOT,
    N.GREATER_THAN_OR_EQUAL,
    N.LESS_THAN_OR_EQUAL,
    ...T
  ],
  RAW_JSON: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  FILES: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  DATE_TIME: [
    N.IS,
    N.IS_RELATIVE,
    N.IS_IN_PAST,
    N.IS_IN_FUTURE,
    N.IS_TODAY,
    N.IS_BEFORE,
    N.IS_AFTER,
    ...T
  ],
  DATE: [
    N.IS,
    N.IS_RELATIVE,
    N.IS_IN_PAST,
    N.IS_IN_FUTURE,
    N.IS_TODAY,
    N.IS_BEFORE,
    N.IS_AFTER,
    ...T
  ],
  RATING: [
    N.IS,
    N.IS_NOT,
    N.GREATER_THAN_OR_EQUAL,
    N.LESS_THAN_OR_EQUAL,
    ...T
  ],
  RELATION: [...O, ...T],
  MULTI_SELECT: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  SELECT: [
    N.IS,
    N.IS_NOT,
    ...T
  ],
  ACTOR: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  ARRAY: [
    N.CONTAINS,
    N.DOES_NOT_CONTAIN,
    ...T
  ],
  BOOLEAN: [N.IS],
  TS_VECTOR: [N.VECTOR_SEARCH],
  UUID: [
    N.IS,
    N.IS_NOT,
    ...T
  ]
};
export {
  S as FILTER_OPERANDS_MAP
};

//# sourceMappingURL=filterOperandsMap.js.map