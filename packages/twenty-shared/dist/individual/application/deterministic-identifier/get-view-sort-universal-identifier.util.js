import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var a = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: i, fieldMetadataUniversalIdentifier: t }) => r({
  entityNamespace: "viewSort",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  a as getViewSortUniversalIdentifier
};

//# sourceMappingURL=get-view-sort-universal-identifier.util.js.map