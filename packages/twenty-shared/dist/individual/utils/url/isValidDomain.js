import { isValidHostname as a } from "./isValidHostname.js";
import { normalizeDomain as l } from "./normalizeDomain.js";
var r = (o) => a(l(o), {
  allowLocalhost: !1,
  allowIp: !1
});
export {
  r as isValidDomain
};

//# sourceMappingURL=isValidDomain.js.map