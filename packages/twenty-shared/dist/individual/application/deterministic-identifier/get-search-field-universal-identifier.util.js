import { computeDeterministicUuid as t } from "./compute-deterministic-uuid.util.js";
var r = ({ applicationUniversalIdentifier: e, fieldMetadataUniversalIdentifier: i }) => t({
  entityNamespace: "searchFieldMetadata",
  value: i,
  applicationUniversalIdentifier: e
});
export {
  r as getSearchFieldUniversalIdentifier
};

//# sourceMappingURL=get-search-field-universal-identifier.util.js.map