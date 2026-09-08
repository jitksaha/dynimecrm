import { computeDeterministicUuid as i } from "./compute-deterministic-uuid.util.js";
var p = ({ applicationUniversalIdentifier: a, objectUniversalIdentifier: e, name: t }) => i({
  entityNamespace: "pageLayout",
  value: e ? `${e}:${t}` : t,
  applicationUniversalIdentifier: a
});
export {
  p as getPageLayoutUniversalIdentifier
};

//# sourceMappingURL=get-page-layout-universal-identifier.util.js.map