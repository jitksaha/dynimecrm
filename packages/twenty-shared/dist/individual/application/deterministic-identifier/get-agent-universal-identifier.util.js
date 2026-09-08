import { computeDeterministicUuid as i } from "./compute-deterministic-uuid.util.js";
var a = ({ applicationUniversalIdentifier: e, name: t }) => i({
  entityNamespace: "agent",
  value: t,
  applicationUniversalIdentifier: e
});
export {
  a as getAgentUniversalIdentifier
};

//# sourceMappingURL=get-agent-universal-identifier.util.js.map