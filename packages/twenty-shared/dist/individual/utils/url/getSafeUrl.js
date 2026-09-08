import { isSafeUrl as r } from "./isSafeUrl.js";
var f = (t) => {
  if (!t || t.trim().length === 0) return;
  if (r(t)) return t;
  const e = `https://${t}`;
  return r(e) ? e : void 0;
};
export {
  f as getSafeUrl
};

//# sourceMappingURL=getSafeUrl.js.map