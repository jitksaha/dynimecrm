import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var o = ({ applicationUniversalIdentifier: e, fieldUniversalIdentifier: t, value: i }) => r({
  entityNamespace: "selectOption",
  value: `${t}:${i}`,
  applicationUniversalIdentifier: e
});
export {
  o as getSelectOptionUniversalIdentifier
};

//# sourceMappingURL=get-select-option-universal-identifier.util.js.map