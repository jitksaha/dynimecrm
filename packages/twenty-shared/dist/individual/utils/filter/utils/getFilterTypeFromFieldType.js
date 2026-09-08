import { FieldMetadataType as e } from "../../../types/FieldMetadataType.js";
var t = (r) => {
  switch (r) {
    case e.DATE_TIME:
      return "DATE_TIME";
    case e.DATE:
      return "DATE";
    case e.LINKS:
      return "LINKS";
    case e.FULL_NAME:
      return "FULL_NAME";
    case e.NUMBER:
      return "NUMBER";
    case e.CURRENCY:
      return "CURRENCY";
    case e.EMAILS:
      return "EMAILS";
    case e.PHONES:
      return "PHONES";
    case e.RELATION:
    case e.MORPH_RELATION:
      return "RELATION";
    case e.SELECT:
      return "SELECT";
    case e.MULTI_SELECT:
      return "MULTI_SELECT";
    case e.ADDRESS:
      return "ADDRESS";
    case e.RATING:
      return "RATING";
    case e.ACTOR:
      return "ACTOR";
    case e.ARRAY:
      return "ARRAY";
    case e.RAW_JSON:
      return "RAW_JSON";
    case e.FILES:
      return "FILES";
    case e.BOOLEAN:
      return "BOOLEAN";
    case e.TS_VECTOR:
      return "TS_VECTOR";
    case e.UUID:
      return "UUID";
    default:
      return "TEXT";
  }
};
export {
  t as getFilterTypeFromFieldType
};

//# sourceMappingURL=getFilterTypeFromFieldType.js.map