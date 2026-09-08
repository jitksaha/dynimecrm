import { isDefined as n } from "../utils/validation/isDefined.js";
var a = /\{(\w+)\}/g, p = (r, e) => n(e) ? r.replace(a, (i, o) => {
  const t = e[o];
  return n(t) ? String(t) : i;
}) : r;
export {
  p as interpolateMessagePlaceholders
};

//# sourceMappingURL=interpolate-message-placeholders.js.map