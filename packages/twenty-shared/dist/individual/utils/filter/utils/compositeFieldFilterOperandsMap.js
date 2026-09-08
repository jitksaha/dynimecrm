import { ViewFilterOperand as _ } from "../../../types/ViewFilterOperand.js";
var E = [_.IS_EMPTY, _.IS_NOT_EMPTY], O = { CURRENCY: {
  currencyCode: [
    _.IS,
    _.IS_NOT,
    ...E
  ],
  amountMicros: [
    _.GREATER_THAN_OR_EQUAL,
    _.LESS_THAN_OR_EQUAL,
    _.IS,
    _.IS_NOT,
    ...E
  ]
} };
export {
  O as COMPOSITE_FIELD_FILTER_OPERANDS_MAP
};

//# sourceMappingURL=compositeFieldFilterOperandsMap.js.map