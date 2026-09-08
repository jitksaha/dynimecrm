import "../../translations/constants/SourceLocale.js";
import { APP_LOCALES as n } from "../../translations/constants/AppLocales.js";
var o = Object.keys(n).reduce((e, r) => {
  const t = r.split("-")[0].toLowerCase();
  return (!e[t] || r === "en") && (e[t] = r), e;
}, {}), c = (e) => {
  if (e === null) return "en";
  if (e in n) return e;
  const r = Object.keys(n).find((i) => i.toLowerCase() === e.toLowerCase());
  if (r) return r;
  const t = e?.trim() ? e.split("-")[0].toLowerCase() : "";
  return o[t] ? o[t] : "en";
};
export {
  c as normalizeLocale
};

//# sourceMappingURL=normalizeLocale.js.map