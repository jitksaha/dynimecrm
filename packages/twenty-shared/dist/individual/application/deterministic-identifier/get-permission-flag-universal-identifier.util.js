import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var a = ({ applicationUniversalIdentifier: e, key: i }) => r({
  entityNamespace: "permissionFlag",
  value: i,
  applicationUniversalIdentifier: e
});
export {
  a as getPermissionFlagUniversalIdentifier
};

//# sourceMappingURL=get-permission-flag-universal-identifier.util.js.map