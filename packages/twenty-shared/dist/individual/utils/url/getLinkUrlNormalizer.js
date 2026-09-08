import { normalizeDomain as i } from "./normalizeDomain.js";
import { normalizeUrlOrigin as o } from "./normalizeUrlOrigin.js";
var n = (r) => r === "domain" ? i : o;
export {
  n as getLinkUrlNormalizer
};

//# sourceMappingURL=getLinkUrlNormalizer.js.map