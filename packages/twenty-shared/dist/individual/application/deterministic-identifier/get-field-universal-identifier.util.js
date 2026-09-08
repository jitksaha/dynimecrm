import { computeDeterministicUuid as a } from "./compute-deterministic-uuid.util.js";
var d = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: i, name: t }) => a({
  entityNamespace: "fieldMetadata",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  d as getFieldUniversalIdentifier
};

//# sourceMappingURL=get-field-universal-identifier.util.js.map