import { getCountries as e } from "libphonenumber-js";
var t = new Set(e()), C = (r) => t.has(r);
export {
  C as isValidCountryCode
};

//# sourceMappingURL=isValidCountryCode.js.map