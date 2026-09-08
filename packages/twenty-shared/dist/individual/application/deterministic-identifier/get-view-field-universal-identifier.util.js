import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var m = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: i, fieldMetadataUniversalIdentifier: t }) => r({
  entityNamespace: "viewField",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  m as getViewFieldUniversalIdentifier
};

//# sourceMappingURL=get-view-field-universal-identifier.util.js.map