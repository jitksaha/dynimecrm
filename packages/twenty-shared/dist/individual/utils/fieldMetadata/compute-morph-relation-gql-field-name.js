import { CustomError as e } from "../errors/CustomError.js";
import { capitalize as _ } from "../strings/capitalize.js";
var N = ({ fieldName: t, relationType: r, targetObjectMetadataNameSingular: a, targetObjectMetadataNamePlural: o }) => {
  if (r === "MANY_TO_ONE") return `${t}${_(a)}`;
  if (r === "ONE_TO_MANY") return `${t}${_(o)}`;
  throw new e(`Invalid relation type (${r}) for field ${t} on ${a}`, "INVALID_RELATION_TYPE_FOR_COMPUTE_MORPH_RELATION_GQL_FIELD_NAME");
};
export {
  N as computeMorphRelationGqlFieldName
};

//# sourceMappingURL=compute-morph-relation-gql-field-name.js.map