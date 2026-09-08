import { FieldMetadataType as t } from "../../types/FieldMetadataType.js";
import { RelationType as A } from "../../types/RelationType.js";
import { FIELD_METADATA_TYPES_NOT_SUPPORTED_IN_GROUP_BY as _ } from "../../constants/FieldMetadataTypesNotSupportedInGroupBy.js";
import { isFieldMetadataDateKind as E } from "./isFieldMetadataDateKind.js";
import { shouldExcludeFieldFromAgentToolSchema as T } from "./shouldExcludeFieldFromAgentToolSchema.js";
var i = /* @__PURE__ */ new Set(["createdAt", "updatedAt"]), d = /* @__PURE__ */ new Set([t.RELATION, t.MORPH_RELATION]), O = ({ type: e, name: r, isSystem: a, relationType: o }) => !(i.has(r) && E(e)) && T({
  fieldName: r,
  isSystem: a
}) || d.has(e) && o === A.ONE_TO_MANY ? !1 : !_.has(e);
export {
  O as isFieldMetadataSupportedInGroupBy
};

//# sourceMappingURL=isFieldMetadataSupportedInGroupBy.js.map