import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var n = ({ objectMetadataApplicationUniversalIdentifier: e, pageLayoutUniversalIdentifier: a, title: i }) => t({
  entityNamespace: "pageLayoutTab",
  value: `${a}:${i}`,
  applicationUniversalIdentifier: e
});
export {
  n as getSystemPageLayoutTabUniversalIdentifier
};

//# sourceMappingURL=get-system-page-layout-tab-universal-identifier.util.js.map