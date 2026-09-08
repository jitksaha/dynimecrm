import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var p = ({ objectMetadataApplicationUniversalIdentifier: e, viewUniversalIdentifier: i, name: t }) => r({
  entityNamespace: "viewFieldGroup",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  p as getSystemViewFieldGroupUniversalIdentifier
};

//# sourceMappingURL=get-system-view-field-group-universal-identifier.util.js.map