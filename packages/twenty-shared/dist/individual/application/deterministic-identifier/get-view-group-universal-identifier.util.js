import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var p = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: i, fieldValue: r }) => t({
  entityNamespace: "viewGroup",
  value: `${i}:${r}`,
  applicationUniversalIdentifier: e
});
export {
  p as getViewGroupUniversalIdentifier
};

//# sourceMappingURL=get-view-group-universal-identifier.util.js.map