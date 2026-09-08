import { isObject as n } from "@sniptt/guards";
var i = [
  "string",
  "number",
  "boolean",
  "array",
  "unknown"
], s = (r) => i.includes(r), o = (r, e) => {
  const t = e.label ?? r;
  return e.type === "record" ? {
    isLeaf: !0,
    type: "string",
    label: t,
    value: null
  } : e.type === "records" ? {
    isLeaf: !0,
    type: "array",
    label: t,
    value: null
  } : e.type === "object" ? {
    isLeaf: !1,
    type: "object",
    label: t,
    value: n(e.properties) ? u(e.properties) : {}
  } : {
    isLeaf: !0,
    type: s(e.type) ? e.type : "unknown",
    label: t,
    value: null
  };
}, u = (r) => Object.entries(r).reduce((e, [t, a]) => (e[t] = o(t, a), e), {}), c = (r) => {
  const e = r[0];
  return e?.type !== "object" || !n(e.properties) ? {} : u(e.properties);
};
export {
  c as inputSchemaToOutputSchema
};

//# sourceMappingURL=input-schema-to-output-schema.js.map