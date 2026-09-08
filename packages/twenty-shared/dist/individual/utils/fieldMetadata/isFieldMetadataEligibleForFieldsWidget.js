import { FieldMetadataType as a } from "../../types/FieldMetadataType.js";
var i = ({ fieldName: r, fieldType: e, isLabelIdentifierField: t }) => !(r === "deletedAt" || e === a.TS_VECTOR || e === a.POSITION || r === "id" && !t || t);
export {
  i as isFieldMetadataEligibleForFieldsWidget
};

//# sourceMappingURL=isFieldMetadataEligibleForFieldsWidget.js.map