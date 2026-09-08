import { computeDeterministicUuid as r } from "./compute-deterministic-uuid.util.js";
var E = {
  INDEX: "INDEX",
  FIELDS_WIDGET: "FIELDS_WIDGET"
}, I = ({ objectMetadataApplicationUniversalIdentifier: e, objectUniversalIdentifier: i, viewKey: t }) => r({
  entityNamespace: "view",
  value: `${i}:${t}`,
  applicationUniversalIdentifier: e
});
export {
  E as SYSTEM_VIEW_KEYS,
  I as getSystemViewUniversalIdentifier
};

//# sourceMappingURL=get-system-view-universal-identifier.util.js.map