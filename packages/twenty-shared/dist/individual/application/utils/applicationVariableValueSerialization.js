import { FieldMetadataType as t } from "../../types/FieldMetadataType.js";
var n = (r, i = t.TEXT) => {
  if (r == null) return "";
  switch (i) {
    case t.BOOLEAN:
      return String(r) === "true" ? "true" : "false";
    case t.NUMBER:
    case t.NUMERIC:
      return String(r);
    case t.ARRAY:
    case t.MULTI_SELECT:
      if (Array.isArray(r)) return JSON.stringify(r);
      if (typeof r == "string") {
        try {
          const s = JSON.parse(r);
          if (Array.isArray(s)) return r;
        } catch {
        }
        return JSON.stringify([r]);
      }
      return JSON.stringify(r);
    case t.RAW_JSON:
    case t.RICH_TEXT:
      return typeof r == "string" ? r : JSON.stringify(r);
    default:
      return typeof r == "string" ? r : String(r);
  }
}, c = (r, i = t.TEXT) => {
  if (r === "") return i === t.ARRAY || i === t.MULTI_SELECT ? [] : "";
  switch (i) {
    case t.BOOLEAN:
      return r === "true";
    case t.NUMBER:
    case t.NUMERIC: {
      const s = Number(r);
      return Number.isNaN(s) ? r : s;
    }
    case t.ARRAY:
    case t.MULTI_SELECT:
      try {
        const s = JSON.parse(r);
        return Array.isArray(s) ? s : [];
      } catch {
        return [];
      }
    case t.RAW_JSON:
    case t.RICH_TEXT:
      try {
        return JSON.parse(r);
      } catch {
        return r;
      }
    default:
      return r;
  }
};
export {
  c as deserializeApplicationVariableValue,
  n as serializeApplicationVariableValue
};

//# sourceMappingURL=applicationVariableValueSerialization.js.map