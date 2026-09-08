import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var n = ({ applicationUniversalIdentifier: e, name: i }) => r({
  entityNamespace: "connectionProvider",
  value: i,
  applicationUniversalIdentifier: e
});
export {
  n as getConnectionProviderUniversalIdentifier
};

//# sourceMappingURL=get-connection-provider-universal-identifier.util.js.map