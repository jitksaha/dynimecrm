import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var l = ({ applicationUniversalIdentifier: e, name: i }) => t({
  entityNamespace: "skill",
  value: i,
  applicationUniversalIdentifier: e
});
export {
  l as getSkillUniversalIdentifier
};

//# sourceMappingURL=get-skill-universal-identifier.util.js.map