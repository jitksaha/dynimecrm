import { computeDeterministicUuid as n } from "./compute-deterministic-uuid.util.js";
var i = ({ applicationUniversalIdentifier: e, componentName: t }) => n({
  entityNamespace: "frontComponent",
  value: t,
  applicationUniversalIdentifier: e
});
export {
  i as getFrontComponentUniversalIdentifier
};

//# sourceMappingURL=get-front-component-universal-identifier.util.js.map