import { isNonEmptyString as p } from "@sniptt/guards";
var i = (r) => {
  const e = { type: "unknown" };
  switch (r.type) {
    case "string":
      e.type = "string";
      break;
    case "number":
    case "integer":
      e.type = "number";
      break;
    case "boolean":
      e.type = "boolean";
      break;
    case "array":
      e.type = "array", r.items && (e.items = i(r.items));
      break;
    case "object":
      e.type = "object", r.properties && (e.properties = Object.fromEntries(Object.entries(r.properties).map(([t, a]) => [t, i(a)])));
      break;
    case "record":
      e.type = "record";
      break;
    case "records":
      e.type = "records";
      break;
    default:
      e.type = "unknown";
  }
  return Array.isArray(r.enum) && (e.enum = r.enum.filter((t) => typeof t == "string")), r.multiline === !0 && (e.multiline = !0), p(r.label) && (e.label = r.label), p(r.objectUniversalIdentifier) && (e.objectUniversalIdentifier = r.objectUniversalIdentifier), e;
}, b = (r) => [i(r)];
export {
  b as jsonSchemaToInputSchema
};

//# sourceMappingURL=json-schema-to-input-schema.js.map