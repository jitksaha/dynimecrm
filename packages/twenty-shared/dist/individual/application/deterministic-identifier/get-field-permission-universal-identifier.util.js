import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var s = ({ applicationUniversalIdentifier: e, roleUniversalIdentifier: i, fieldUniversalIdentifier: r }) => t({
  entityNamespace: "fieldPermission",
  value: `${i}:${r}`,
  applicationUniversalIdentifier: e
});
export {
  s as getFieldPermissionUniversalIdentifier
};

//# sourceMappingURL=get-field-permission-universal-identifier.util.js.map