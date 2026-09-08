import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var n = ({ fieldMetadataApplicationUniversalIdentifier: e, viewUniversalIdentifier: i, fieldMetadataUniversalIdentifier: t }) => r({
  entityNamespace: "viewField",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  n as getSystemViewFieldUniversalIdentifier
};

//# sourceMappingURL=get-system-view-field-universal-identifier.util.js.map