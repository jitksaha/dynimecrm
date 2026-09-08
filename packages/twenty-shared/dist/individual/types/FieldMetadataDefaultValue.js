import { FieldMetadataType as a } from "./FieldMetadataType.js";
var i = {
  UUID: "uuid",
  NOW: "now"
}, t = [
  a.RELATION,
  a.MORPH_RELATION,
  a.FILES,
  a.TS_VECTOR
], E = (e) => !t.includes(e);
export {
  t as FIELD_METADATA_TYPES_WITHOUT_DEFAULT_VALUE,
  i as fieldMetadataDefaultValueFunctionName,
  E as isFieldMetadataTypeWithDefaultValue
};

//# sourceMappingURL=FieldMetadataDefaultValue.js.map