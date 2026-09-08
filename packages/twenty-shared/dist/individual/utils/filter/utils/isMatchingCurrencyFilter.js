import { isDefined as e } from "../../validation/isDefined.js";
import { isNonEmptyString as f } from "@sniptt/guards";
var d = (r, n) => {
  switch (!0) {
    case r?.in !== void 0:
      return f(n) && r.in.includes(n);
    case r?.is !== void 0:
      return r.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(`Unexpected operand for currency code filter : ${JSON.stringify(r)}`);
  }
}, o = (r, n) => {
  switch (!0) {
    case r?.eq !== void 0:
      return n === r.eq;
    case r?.neq !== void 0:
      return n !== r.neq;
    case r?.gt !== void 0:
      return e(n) && n > r.gt;
    case r?.gte !== void 0:
      return e(n) && n >= r.gte;
    case r?.lt !== void 0:
      return e(n) && n < r.lt;
    case r?.lte !== void 0:
      return e(n) && n <= r.lte;
    case r?.is !== void 0:
      return r.is === "NULL" ? n === null : n !== null;
    default:
      throw new Error(`Unexpected operand for currency amount micros filter : ${JSON.stringify(r)}`);
  }
}, h = ({ currencyFilter: r, value: n }) => {
  const t = e(r.currencyCode), s = e(r.amountMicros);
  if (t && s) return o(r.amountMicros, n.amountMicros) && d(r.currencyCode, n.currencyCode);
  if (s) return o(r.amountMicros, n.amountMicros);
  if (t) return d(r.currencyCode, n.currencyCode);
  throw new Error(`Unexpected filter for currency : ${JSON.stringify(r)}`);
};
export {
  h as isMatchingCurrencyFilter
};

//# sourceMappingURL=isMatchingCurrencyFilter.js.map