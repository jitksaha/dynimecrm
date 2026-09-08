import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var n = ({ applicationUniversalIdentifier: e, name: i }) => t({
  entityNamespace: "navigationMenuItem",
  value: `FOLDER:${i}`,
  applicationUniversalIdentifier: e
}), v = ({ applicationUniversalIdentifier: e, objectUniversalIdentifier: i }) => t({
  entityNamespace: "navigationMenuItem",
  value: `OBJECT:${i}`,
  applicationUniversalIdentifier: e
}), r = ({ applicationUniversalIdentifier: e, viewUniversalIdentifier: i }) => t({
  entityNamespace: "navigationMenuItem",
  value: `VIEW:${i}`,
  applicationUniversalIdentifier: e
}), m = ({ applicationUniversalIdentifier: e, link: i }) => t({
  entityNamespace: "navigationMenuItem",
  value: `LINK:${i}`,
  applicationUniversalIdentifier: e
});
export {
  n as getFolderNavigationMenuItemUniversalIdentifier,
  m as getLinkNavigationMenuItemUniversalIdentifier,
  v as getObjectNavigationMenuItemUniversalIdentifier,
  r as getViewNavigationMenuItemUniversalIdentifier
};

//# sourceMappingURL=get-navigation-menu-item-universal-identifier.util.js.map