import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var a = ({ applicationUniversalIdentifier: e, roleUniversalIdentifier: i, permissionFlagUniversalIdentifier: r }) => t({
  entityNamespace: "rolePermissionFlag",
  value: `${i}:${r}`,
  applicationUniversalIdentifier: e
});
export {
  a as getRolePermissionFlagUniversalIdentifier
};

//# sourceMappingURL=get-role-permission-flag-universal-identifier.util.js.map