import { ensureAbsoluteUrl as i } from "./ensureAbsoluteUrl.js";
import { normalizeUrlOrigin as m } from "./normalizeUrlOrigin.js";
var n = (e) => {
  const r = e.trim();
  return r === "" ? r : m(i(r));
};
export {
  n as normalizeUrl
};

//# sourceMappingURL=normalizeUrl.js.map