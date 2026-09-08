import { isDefined as n } from "../utils/validation/isDefined.js";
import { isRecordObjectSchema as u } from "./is-record-object-schema.js";
import { isNonEmptyString as f, isObject as y } from "@sniptt/guards";
var c = (i, r) => {
  const o = f(i) ? r?.(i) : void 0;
  return `Id of the ${f(o) ? o : "linked"} record`;
}, d = (i, r) => {
  if (u(i)) return {
    type: "string",
    description: c(i.objectUniversalIdentifier, r)
  };
  if (i.type === "records") return {
    type: "array",
    items: {
      type: "string",
      description: c(i.objectUniversalIdentifier, r)
    }
  };
  const { objectUniversalIdentifier: o, multiline: I, label: b, items: p, properties: s, additionalProperties: t, ...m } = i, e = { ...m };
  return n(p) && (e.items = d(p, r)), n(s) && (e.properties = Object.fromEntries(Object.entries(s).map(([a, l]) => [a, d(l, r)]))), n(t) && (e.additionalProperties = y(t) ? d(t, r) : t), e;
};
export {
  d as buildToolInputJsonSchema
};

//# sourceMappingURL=build-tool-input-json-schema.js.map