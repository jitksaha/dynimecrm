import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var a = "navigation", m = ({ objectMetadataApplicationUniversalIdentifier: e, objectUniversalIdentifier: i }) => t({
  entityNamespace: "commandMenuItem",
  value: `${i}:${a}`,
  applicationUniversalIdentifier: e
});
export {
  m as getSystemNavigationCommandMenuItemUniversalIdentifier
};

//# sourceMappingURL=get-system-navigation-command-menu-item-universal-identifier.util.js.map