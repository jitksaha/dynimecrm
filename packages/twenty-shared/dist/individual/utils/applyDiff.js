import { isDefined as h } from "./validation/isDefined.js";
import { isNumber as c, isObject as y, isString as d } from "@sniptt/guards";
var p = /* @__PURE__ */ Symbol("micropatch-delete"), u = [
  "__proto__",
  "constructor",
  "prototype"
], O = (e, t) => {
  if (!h(e)) throw new Error("Cannot apply diff to null or undefined object");
  if (!Array.isArray(t)) throw new Error("Diffs must be an array");
  const r = $(e), o = [];
  for (const n of t)
    if (!(!n || !n.path || n.path.length === 0))
      try {
        w(r, n, o);
      } catch (a) {
        throw new Error(`Failed to apply diff at path ${n.path.join(".")}: ${a}`);
      }
  return o.forEach((n) => n()), r;
}, w = (e, t, r) => {
  const { path: o, type: n } = t, a = "value" in t ? t.value : void 0, i = o[o.length - 1], l = v(e, o);
  switch (n) {
    case "CREATE":
    case "CHANGE":
      E(l, i, a);
      break;
    case "REMOVE":
      m(e, o, l, i, r);
      break;
    default:
      throw new Error(`Unsupported diff type: ${n}`);
  }
}, v = (e, t) => {
  let r = e;
  for (let o = 0; o < t.length - 1; o++) {
    const n = t[o];
    if (r == null) throw new Error(`Cannot traverse path: found null/undefined at element ${o}`);
    if (c(n) && !Array.isArray(r)) throw new Error(`Expected array at path element ${o}, got ${typeof r}`);
    if (d(n) && Array.isArray(r)) throw new Error(`Expected object at path element ${o}, got array`);
    Array.isArray(r), r = r[n];
  }
  return r;
}, E = (e, t, r) => {
  if (Array.isArray(e)) {
    if (!c(t)) throw new Error(`Expected numeric index for array, got ${typeof t}`);
    try {
      e[t] = r;
    } catch (o) {
      throw new Error(`Cannot set array element at index ${t}: ${o}. Array may be non-extensible.`);
    }
  } else if (y(e)) {
    if (u.includes(t)) throw new Error(`Refusing to set forbidden property key '${t}' on object (prototype pollution protection)`);
    try {
      e[t] = r;
    } catch (o) {
      throw new Error(`Cannot set property '${String(t)}': ${o}. Object may be non-extensible.`);
    }
  } else throw new Error(`Expected object or array, got ${typeof e}`);
}, m = (e, t, r, o, n) => {
  Array.isArray(r) ? A(e, t, r, o, n) : g(r, o);
}, A = (e, t, r, o, n) => {
  if (typeof o != "number") throw new Error(`Expected numeric index for array removal, got ${typeof o}`);
  r[o] = p, n.push(() => {
    t.length === 1 ? Array.isArray(e) && f(e) : f(r);
  });
}, g = (e, t) => {
  u.includes(t) || delete e[t];
}, f = (e) => {
  const t = [];
  for (let r = 0; r < e.length; r++) e[r] === p && t.push(r);
  for (let r = t.length - 1; r >= 0; r--) e.splice(t[r], 1);
}, $ = (e) => {
  if (e === null || !y(e)) return e;
  if (typeof structuredClone < "u") try {
    return structuredClone(e);
  } catch {
    return s(e);
  }
  return s(e);
}, s = (e) => {
  try {
    return JSON.parse(JSON.stringify(e));
  } catch {
    throw new Error("Failed to clone object");
  }
};
export {
  O as applyDiff
};

//# sourceMappingURL=applyDiff.js.map