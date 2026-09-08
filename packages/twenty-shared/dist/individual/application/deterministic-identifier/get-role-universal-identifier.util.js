import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var o = ({ applicationUniversalIdentifier: e, label: i }) => t({
  entityNamespace: "role",
  value: i,
  applicationUniversalIdentifier: e
});
export {
  o as getRoleUniversalIdentifier
};

//# sourceMappingURL=get-role-universal-identifier.util.js.map