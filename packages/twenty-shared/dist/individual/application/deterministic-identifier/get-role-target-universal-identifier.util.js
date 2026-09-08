import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var a = ({ applicationUniversalIdentifier: e, agentUniversalIdentifier: t }) => r({
  entityNamespace: "roleTarget",
  value: t,
  applicationUniversalIdentifier: e
});
export {
  a as getRoleTargetUniversalIdentifier
};

//# sourceMappingURL=get-role-target-universal-identifier.util.js.map