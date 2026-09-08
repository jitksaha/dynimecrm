import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var m = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: i, name: t }) => r({
  entityNamespace: "view",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  m as getViewUniversalIdentifier
};

//# sourceMappingURL=get-view-universal-identifier.util.js.map