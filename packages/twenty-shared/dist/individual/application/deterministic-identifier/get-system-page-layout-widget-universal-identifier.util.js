import { computeDeterministicUuid as a } from "./compute-deterministic-uuid.util.js";
var n = ({ objectMetadataApplicationUniversalIdentifier: e, pageLayoutTabUniversalIdentifier: i, title: t }) => a({
  entityNamespace: "pageLayoutWidget",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  n as getSystemPageLayoutWidgetUniversalIdentifier
};

//# sourceMappingURL=get-system-page-layout-widget-universal-identifier.util.js.map