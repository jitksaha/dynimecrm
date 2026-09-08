import { computeMorphRelationGqlFieldName as r } from "./compute-morph-relation-gql-field-name.js";
var n = ({ name: e }) => `${e}Id`, a = ({ fieldName: e, relationType: o, targetObjectMetadataNameSingular: l, targetObjectMetadataNamePlural: m }) => n({ name: r({
  fieldName: e,
  relationType: o,
  targetObjectMetadataNameSingular: l,
  targetObjectMetadataNamePlural: m
}) });
export {
  a as computeMorphRelationGqlFieldJoinColumnName,
  n as computeRelationGqlFieldJoinColumnName
};

//# sourceMappingURL=compute-relation-gql-field-join-column-name.js.map