import { computeDeterministicUuid as i } from "./compute-deterministic-uuid.util.js";
var r = ({ applicationUniversalIdentifier: e, nameSingular: t }) => i({
  entityNamespace: "objectMetadata",
  value: t,
  applicationUniversalIdentifier: e
});
export {
  r as getObjectUniversalIdentifier
};

//# sourceMappingURL=get-object-universal-identifier.util.js.map