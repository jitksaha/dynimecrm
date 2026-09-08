import { isDefined as c } from "./validation/isDefined.js";
import { evalFromContext as s } from "./evalFromContext.js";
var y = (r) => typeof r == "string", i = RegExp("\\{\\{([^{}]+)\\}\\}", "g"), b = (r) => y(r) && c(r.match(i)), o = (r, e) => c(r) ? y(r) ? n(r, e) : Array.isArray(r) ? m(r, e) : typeof r == "object" && r !== null ? l(r, e) : r : r, m = (r, e) => {
  const t = r;
  for (let a = 0; a < r.length; ++a) t[a] = o(r[a], e);
  return t;
}, l = (r, e) => Object.entries(r).reduce((t, [a, g]) => {
  const f = o(a, e);
  return t[typeof f == "string" ? f : String(f)] = o(g, e), t;
}, {}), n = (r, e) => {
  const t = r.match(i);
  return !t || t.length === 0 ? r : t.length === 1 && t[0] === r ? s(r, e) : r.replace(i, (a, g) => {
    const f = s(a, e);
    return typeof f == "object" && f !== null ? JSON.stringify(f) : f;
  });
};
export {
  b as isVariableReference,
  o as resolveInput
};

//# sourceMappingURL=variable-resolver.js.map