import "../translations/constants/SourceLocale.js";
import { setupI18n as a } from "@lingui/core";
var u = (r) => {
  const c = {};
  return (t) => {
    const e = c[t];
    if (e !== void 0) return e;
    const s = r.en ?? {}, o = r[t] ?? s, n = a();
    return n.load(t, o), n.activate(t), c[t] = n, n;
  };
};
export {
  u as createI18nInstanceFactory
};

//# sourceMappingURL=create-i18n-instance-factory.js.map