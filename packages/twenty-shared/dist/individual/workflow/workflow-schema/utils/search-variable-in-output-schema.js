import { isDefined as i } from "../../../utils/validation/isDefined.js";
import { FieldMetadataType as S } from "../../../types/FieldMetadataType.js";
import { CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX as I } from "../../constants/CaptureAllVariableTagInnerRegex.js";
import { parseVariablePath as d } from "../../utils/variable-path.util.js";
import { isFlattenedArrayOutputSchema as L } from "./flattened-array-output-schema.js";
import { isObject as R } from "class-validator";
var o = {
  variableLabel: void 0,
  variablePathLabel: void 0
}, P = [
  "CREATE_RECORD",
  "UPDATE_RECORD",
  "DELETE_RECORD",
  "UPSERT_RECORD",
  "PICK_RECORD"
], m = (e) => R(e) && "_outputSchemaType" in e && e._outputSchemaType === "RECORD", O = (e) => !i(e) || !R(e) || Array.isArray(e) ? !1 : !(R(e) && "_outputSchemaType" in e), v = (e) => e.replace(I, (t, a) => a), g = (e, t) => m(t) ? t.fields[e] : t[e], A = (e, t) => {
  if (!m(e))
    return e[t]?.isCompositeSubField ? t : void 0;
}, $ = (e) => e === "id" || e.endsWith(".id"), F = (e, t) => {
  let a = e;
  const n = [];
  for (const r of t) {
    const l = g(r, a);
    if (!i(l)) return null;
    i(l.label) && n.push(l.label);
    const u = l.value;
    if (!i(u)) return null;
    a = u;
  }
  return {
    schema: a,
    pathLabels: n
  };
}, C = (e, t, a, n, r, l) => {
  const u = g(n, a), c = r && m(a) && $(n) ? a.object.label : u?.label;
  if (!c) return o;
  const h = [
    e,
    ...t,
    c
  ].join(" > ");
  return {
    variableLabel: c,
    variablePathLabel: l ? `${h} (${l})` : h,
    variableType: u?.type,
    fieldMetadataId: u?.fieldMetadataId,
    compositeFieldSubFieldName: A(a, n)
  };
}, p = ({ stepName: e, recordOutputSchema: t, path: a, selectedField: n, isFullRecord: r, stepNameLabel: l }) => {
  const u = F(t, a);
  return u ? C(e, u.pathLabels, u.schema, n, r, l) : o;
}, _ = (e, t) => {
  let a = e;
  const n = [];
  for (const r of t) {
    const l = a[r];
    if (!i(l) || l.isLeaf === !0 || !i(l.value)) return null;
    n.push(l.label), a = l.value;
  }
  return {
    schema: a,
    pathLabels: n
  };
}, T = ({ stepName: e, baseOutputSchema: t, path: a, selectedField: n }) => {
  const r = _(t, a);
  if (!r) return o;
  const l = r.schema[n];
  if (!i(l)) return o;
  const u = [
    e,
    ...r.pathLabels,
    l.label
  ].join(" > ");
  return {
    variableLabel: l.label,
    variablePathLabel: u,
    variableType: l.type
  };
}, y = ({ stepName: e, recordOutputSchema: t, rawVariableName: a, isFullRecord: n }) => {
  if (!i(t)) return o;
  const r = d(v(a)), l = r[0], u = r[r.length - 1], c = r.slice(1, -1);
  return !i(l) || !i(u) ? o : p({
    stepName: e,
    recordOutputSchema: t,
    selectedField: u,
    path: c,
    isFullRecord: n
  });
}, D = ({ stepName: e, recordOutputSchema: t, rawVariableName: a, isFullRecord: n }) => {
  if (!i(t)) return o;
  const r = d(v(a)), l = r[0], u = [r.slice(1, 4).join("."), ...r.slice(4)], c = u[u.length - 1], h = u.slice(0, -1);
  return !i(l) || !i(c) ? o : p({
    stepName: e,
    recordOutputSchema: t,
    selectedField: c,
    path: h,
    isFullRecord: n
  });
}, E = ({ stepName: e, baseOutputSchema: t, rawVariableName: a }) => {
  if (!i(t)) return o;
  const n = d(v(a)), r = n[0], l = n[n.length - 1], u = n.slice(1, -1);
  return !i(r) || !i(l) ? o : T({
    stepName: e,
    baseOutputSchema: t,
    path: u,
    selectedField: l
  });
}, B = ({ stepName: e, findRecordsOutputSchema: t, rawVariableName: a, isFullRecord: n, stepNameLabel: r }) => {
  if (!i(t)) return o;
  const l = d(v(a)), u = l[0], c = l[1], h = l.slice(2);
  if (!i(u) || !i(c)) return o;
  if (c === "first") {
    const f = t.first?.value, s = h[h.length - 1], b = h.slice(0, -1);
    return !i(f) || !i(s) ? o : p({
      stepName: `${e} > ${t.first?.label ?? "First"}`,
      recordOutputSchema: f,
      selectedField: s,
      path: b,
      isFullRecord: n,
      stepNameLabel: r
    });
  }
  if (c === "totalCount") {
    const f = t.totalCount?.label ?? "Total Count", s = `${e} > ${f}`;
    return {
      variableLabel: f,
      variablePathLabel: r ? `${s} (${r})` : s,
      variableType: S.NUMBER
    };
  }
  if (c === "all") {
    const f = t.all?.label ?? "All Records", s = `${e} > ${f}`;
    return {
      variableLabel: f,
      variablePathLabel: r ? `${s} (${r})` : s,
      variableType: S.ARRAY
    };
  }
  return o;
}, M = ({ stepName: e, formOutputSchema: t, rawVariableName: a, isFullRecord: n }) => {
  if (!i(t)) return o;
  const r = d(v(a)), l = r[0], u = r[1], c = r.slice(2), h = c[c.length - 1], f = c.slice(0, -1);
  if (!i(l) || !i(u)) return o;
  const s = t[u];
  return i(s) ? s.isLeaf ? {
    variableLabel: s.label,
    variablePathLabel: `${e} > ${s.label}`,
    variableType: s.type
  } : !s.isLeaf && i(h) ? p({
    stepName: `${e} > ${s.label}`,
    recordOutputSchema: s.value,
    selectedField: h,
    path: f,
    isFullRecord: n
  }) : o : o;
}, U = ({ stepName: e, codeOutputSchema: t, rawVariableName: a }) => !i(t) || R(t) && "_outputSchemaType" in t && t._outputSchemaType === "LINK" ? o : d(v(a)).length === 1 && L(t) ? {
  variableLabel: e,
  variablePathLabel: e,
  variableType: S.ARRAY
} : E({
  stepName: e,
  baseOutputSchema: t,
  rawVariableName: a
}), j = ({ stepName: e, iteratorOutputSchema: t, rawVariableName: a, isFullRecord: n }) => {
  if (!i(t)) return o;
  const r = d(v(a)), l = r[0], u = r[1], c = r.slice(2);
  if (!i(l) || !i(u)) return o;
  if (u === "currentItemIndex") return {
    variableLabel: "Current Item Index",
    variablePathLabel: `${e} > Current Item Index`,
    variableType: S.NUMBER
  };
  if (u === "hasProcessedAllItems") return {
    variableLabel: "Has Processed All Items",
    variablePathLabel: `${e} > Has Processed All Items`,
    variableType: S.BOOLEAN
  };
  if (u === "currentItem") {
    const h = t.currentItem.value;
    if (!i(h)) return o;
    const f = c[c.length - 1], s = c.slice(0, -1);
    if (m(h) && i(f)) return p({
      stepName: `${e} > Current Item`,
      recordOutputSchema: h,
      path: s,
      selectedField: f,
      isFullRecord: n
    });
    if (O(h) && i(f)) return T({
      stepName: e,
      baseOutputSchema: h,
      path: s,
      selectedField: f
    });
    const b = t.currentItem;
    return {
      variableLabel: b.label,
      variablePathLabel: `${e} > ${b.label}`,
      variableType: b.isLeaf ? b.type : "unknown"
    };
  }
  return o;
}, x = ({ stepName: e, manualTriggerOutputSchema: t, rawVariableName: a, isFullRecord: n }) => {
  if (!i(t)) return o;
  const r = d(v(a)), l = r[0], u = r[1], c = r.slice(2), h = c[c.length - 1], f = c.slice(0, -1);
  if (!i(l) || !i(u) || !i(h)) return o;
  if (u === "payload") {
    const { payload: s } = t;
    if (!i(s)) return o;
    const b = `${e} > ${s.label}`;
    return m(s.value) ? p({
      stepName: b,
      recordOutputSchema: s.value,
      selectedField: h,
      path: f,
      isFullRecord: n
    }) : T({
      stepName: b,
      baseOutputSchema: s.value,
      path: f,
      selectedField: h
    });
  }
  if (u === "metadata") {
    const { metadata: s } = t;
    return T({
      stepName: `${e} > ${s.label}`,
      baseOutputSchema: s.value,
      path: f,
      selectedField: h
    });
  }
  return o;
}, X = ({ schema: e, stepType: t, stepName: a, rawVariableName: n, isFullRecord: r, stepNameLabel: l }) => P.includes(t) ? y({
  stepName: a,
  recordOutputSchema: e,
  rawVariableName: n,
  isFullRecord: r
}) : t === "MANUAL" ? x({
  stepName: a,
  manualTriggerOutputSchema: e,
  rawVariableName: n,
  isFullRecord: r
}) : t === "DATABASE_EVENT" ? D({
  stepName: a,
  recordOutputSchema: e,
  rawVariableName: n,
  isFullRecord: r
}) : t === "FIND_RECORDS" ? B({
  stepName: a,
  findRecordsOutputSchema: e,
  rawVariableName: n,
  isFullRecord: r,
  stepNameLabel: l
}) : t === "FORM" ? M({
  stepName: a,
  formOutputSchema: e,
  rawVariableName: n,
  isFullRecord: r
}) : t === "CODE" ? U({
  stepName: a,
  codeOutputSchema: e,
  rawVariableName: n
}) : t === "ITERATOR" ? j({
  stepName: a,
  iteratorOutputSchema: e,
  rawVariableName: n,
  isFullRecord: r
}) : E({
  stepName: a,
  baseOutputSchema: e,
  rawVariableName: n
});
export {
  p as searchRecordOutputSchema,
  X as searchVariableInOutputSchema
};

//# sourceMappingURL=search-variable-in-output-schema.js.map