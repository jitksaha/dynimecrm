import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var o = ({ applicationUniversalIdentifier: e, roleUniversalIdentifier: i, objectUniversalIdentifier: t }) => r({
  entityNamespace: "objectPermission",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  o as getObjectPermissionUniversalIdentifier
};

//# sourceMappingURL=get-object-permission-universal-identifier.util.js.map