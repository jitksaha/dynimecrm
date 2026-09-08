import { isDefined as t } from "../../utils/validation/isDefined.js";
import { isRecordObjectSchema as o } from "../../logic-function/is-record-object-schema.js";
var s = (r) => r.map((e) => {
  if (o(e)) return null;
  if (e.type === "records") return [];
  if (t(e.type) && [
    "string",
    "number",
    "boolean"
  ].includes(e.type)) return e.enum && e.enum.length > 0 ? e.enum[0] : null;
  if (e.type === "object") {
    const n = {};
    return t(e.properties) && Object.entries(e.properties).forEach(([u, i]) => {
      n[u] = s([i])[0];
    }), n;
  } else if (e.type === "array" && t(e.items)) return [];
  return null;
});
export {
  s as getFunctionInputFromInputSchema
};

//# sourceMappingURL=getFunctionInputFromInputSchema.js.map