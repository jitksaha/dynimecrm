import { getCountries as r, getCountryCallingCode as s } from "libphonenumber-js";
var o = /* @__PURE__ */ new Map();
for (const t of r()) {
  const e = s(t), n = o.get(e);
  n ? n.push(t) : o.set(e, [t]);
}
var i = (t) => {
  const e = t.startsWith("+") ? t.slice(1) : t;
  return o.get(e) ?? [];
};
export {
  i as getCountryCodesForCallingCode
};

//# sourceMappingURL=getCountryCodesForCallingCode.js.map