import { isDefined as c } from "../../../utils/validation/isDefined.js";
import { isPlainObject as f } from "../../../utils/typeguard/isPlainObject.js";
import { isBoolean as S, isString as v } from "class-validator";
var u = { found: !1 }, o = (r) => f(r) && S(r.isLeaf), s = (r) => f(r) && r._outputSchemaType === "RECORD" && f(r.fields), h = (r) => f(r) && !("_outputSchemaType" in r) && o(r.first) && r.first.isLeaf === !1 && s(r.first.value) && o(r.totalCount), p = (r) => ({
  found: !0,
  type: v(r.type) ? r.type : void 0,
  label: v(r.label) ? r.label : void 0
}), b = (r, t) => t.length === 0 ? p(r) : d(r.value, t), F = (r, t) => {
  for (let e = 1; e <= t.length; e++) {
    const i = r[t.slice(0, e).join(".")];
    if (o(i)) return b(i, t.slice(e));
  }
  return u;
}, y = (r, t) => {
  const [e, ...i] = t;
  if (e === "first")
    return i.length === 0 ? p(r.first) : d(r.first.value, i);
  if (e === "all" || e === "totalCount") {
    const n = r[e];
    return i.length === 0 && o(n) ? p(n) : u;
  }
  return u;
}, O = (r, t) => {
  const [e, ...i] = t, n = r[e];
  return o(n) ? b(n, i) : c(n) ? i.length === 0 ? { found: !0 } : f(n) ? O(n, i) : u : u;
}, d = (r, t) => t.length === 0 || !f(r) ? u : s(r) ? F(r.fields, t) : h(r) ? y(r, t) : O(r, t), g = ({ schema: r, propertyPath: t }) => d(r, t), l = (r) => {
  const t = [];
  for (const [e, i] of Object.entries(r)) if (o(i)) {
    if (t.push(e), i.isLeaf) continue;
    const n = i.value;
    if (s(n)) for (const a of l(n.fields)) t.push(`${e}.${a}`);
    else if (f(n)) for (const a of l(n)) t.push(`${e}.${a}`);
  } else if (c(i) && (t.push(e), f(i)))
    for (const n of l(i)) t.push(`${e}.${n}`);
  return t;
}, R = (r) => {
  if (!f(r)) return [];
  if (s(r)) return l(r.fields);
  if (h(r)) {
    const t = [];
    if (o(r.first)) {
      t.push("first");
      for (const e of R(r.first.value)) t.push(`first.${e}`);
    }
    return c(r.all) && t.push("all"), t.push("totalCount"), t;
  }
  return l(r);
};
export {
  R as collectOutputSchemaVariablePaths,
  d as resolveInSchema,
  g as resolveVariablePathInOutputSchema
};

//# sourceMappingURL=resolve-variable-path-in-output-schema.js.map