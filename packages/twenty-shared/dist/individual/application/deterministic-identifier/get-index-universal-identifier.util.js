import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var a = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: i, name: t }) => r({
  entityNamespace: "index",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  a as getIndexUniversalIdentifier
};

//# sourceMappingURL=get-index-universal-identifier.util.js.map