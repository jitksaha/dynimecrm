import { isDefined as n } from "../../../utils/validation/isDefined.js";
var i = (e) => {
  if (!n(e)) return !1;
  const r = Object.keys(e);
  return r.length === 0 ? !1 : r.every((t, u) => t === String(u));
}, f = ({ schema: e, label: r = "Current Item" }) => {
  const t = e[0];
  if (n(t))
    return {
      ...t,
      label: r
    };
};
export {
  f as getCurrentItemSchemaFromFlattenedArrayOutputSchema,
  i as isFlattenedArrayOutputSchema
};

//# sourceMappingURL=flattened-array-output-schema.js.map