import { computeDeterministicUuid as m } from "./compute-deterministic-uuid.util.js";
var n = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: i, fieldMetadataUniversalIdentifier: t, operand: r, subFieldName: a }) => m({
  entityNamespace: "viewFilter",
  value: `${i}:${t}:${r}:${a ?? ""}`,
  applicationUniversalIdentifier: e
});
export {
  n as getViewFilterUniversalIdentifier
};

//# sourceMappingURL=get-view-filter-universal-identifier.util.js.map