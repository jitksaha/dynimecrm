import { computeDeterministicUuid as a } from "./compute-deterministic-uuid.util.js";
var r = ({ applicationUniversalIdentifier: i, key: e }) => a({
  entityNamespace: "applicationVariable",
  value: e,
  applicationUniversalIdentifier: i
});
export {
  r as getApplicationVariableUniversalIdentifier
};

//# sourceMappingURL=get-application-variable-universal-identifier.util.js.map