import { FieldMetadataType as a } from "../../types/FieldMetadataType.js";
var m = [
  a.TEXT,
  a.NUMBER,
  a.BOOLEAN,
  a.DATE,
  a.DATE_TIME,
  a.SELECT,
  a.RATING
], d = { [a.FULL_NAME]: [{
  subFieldName: "firstName",
  subFieldLabel: "First name"
}, {
  subFieldName: "lastName",
  subFieldLabel: "Last name"
}] }, f = (t) => {
  const i = [];
  for (const e of t) {
    if (e.isSystem === !0 || e.isActive === !1) continue;
    if (m.includes(e.type)) {
      i.push({
        name: e.name,
        label: e.label,
        fieldName: e.name,
        fieldType: e.type
      });
      continue;
    }
    const l = d[e.type];
    if (l)
      for (const { subFieldName: s, subFieldLabel: n } of l) i.push({
        name: `${e.name}.${s}`,
        label: l.length === 1 ? e.label : `${e.label} · ${n}`,
        fieldName: e.name,
        fieldType: e.type,
        subFieldName: s
      });
  }
  return i;
};
export {
  f as listCampaignVariablesForFields
};

//# sourceMappingURL=list-campaign-variables-for-fields.js.map