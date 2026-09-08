import { computeDeterministicUuid as a } from "./compute-deterministic-uuid.util.js";
var r = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: t, relationTargetObjectUniversalIdentifier: i }) => a({
  entityNamespace: "fieldMetadata",
  value: `${t}:systemRelation:${i}`,
  applicationUniversalIdentifier: e
});
export {
  r as getSystemRelationFieldUniversalIdentifier
};

//# sourceMappingURL=get-system-relation-field-universal-identifier.util.js.map