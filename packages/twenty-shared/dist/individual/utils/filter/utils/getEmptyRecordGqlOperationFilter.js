import { ViewFilterOperand as r } from "../../../types/ViewFilterOperand.js";
import { CustomError as k } from "../../errors/CustomError.js";
import { getFilterTypeFromFieldType as U } from "./getFilterTypeFromFieldType.js";
import { computeEmptyGqlOperationFilterForEmails as E } from "../computeEmptyGqlOperationFilterForEmails.js";
import { computeEmptyGqlOperationFilterForLinks as i } from "../computeEmptyGqlOperationFilterForLinks.js";
import { generateILikeFiltersForCompositeFields as b } from "./generateILikeFiltersForCompositeFields.js";
import { isNonEmptyString as y } from "@sniptt/guards";
var h = ({ operand: N, correspondingField: a, recordFilter: s }) => {
  let e = {};
  const t = s.subFieldName, L = y(t), m = U(a.type);
  switch (m) {
    case "TEXT":
      e = { or: [{ [a.name]: { ilike: "" } }, { [a.name]: { is: "NULL" } }] };
      break;
    case "PHONES":
      if (!L) e = { and: [{ or: [{ [a.name]: { primaryPhoneNumber: { is: "NULL" } } }, { [a.name]: { primaryPhoneNumber: { ilike: "" } } }] }, { or: [{ [a.name]: { additionalPhones: { is: "NULL" } } }, { [a.name]: { additionalPhones: { like: "[]" } } }] }] };
      else switch (t) {
        case "primaryPhoneNumber":
        case "primaryPhoneCallingCode":
          e = { or: [{ [a.name]: { [t]: { is: "NULL" } } }, { [a.name]: { [t]: { ilike: "" } } }] };
          break;
        case "additionalPhones":
          e = { or: [{ [a.name]: { additionalPhones: { is: "NULL" } } }, { [a.name]: { additionalPhones: { like: "[]" } } }] };
          break;
        default:
          throw new Error(`Unsupported composite field name ${t} for filter type ${m}`);
      }
      break;
    case "CURRENCY":
      e = { or: [{ [a.name]: { amountMicros: { is: "NULL" } } }] };
      break;
    case "FULL_NAME":
      L ? e = { or: [{ [a.name]: { [t]: { ilike: "" } } }, { [a.name]: { [t]: { is: "NULL" } } }] } : e = { and: b("", a.name, ["firstName", "lastName"], !0) };
      break;
    case "LINKS":
      e = i({
        correspondingFieldMetadataItem: a,
        recordFilter: s
      });
      break;
    case "ADDRESS":
      L ? e = { or: [{ [a.name]: { [t]: { ilike: "" } } }, { [a.name]: { [t]: { is: "NULL" } } }] } : e = { and: [
        { or: [{ [a.name]: { addressStreet1: { ilike: "" } } }, { [a.name]: { addressStreet1: { is: "NULL" } } }] },
        { or: [{ [a.name]: { addressStreet2: { ilike: "" } } }, { [a.name]: { addressStreet2: { is: "NULL" } } }] },
        { or: [{ [a.name]: { addressCity: { ilike: "" } } }, { [a.name]: { addressCity: { is: "NULL" } } }] },
        { or: [{ [a.name]: { addressState: { ilike: "" } } }, { [a.name]: { addressState: { is: "NULL" } } }] },
        { or: [{ [a.name]: { addressCountry: { ilike: "" } } }, { [a.name]: { addressCountry: { is: "NULL" } } }] },
        { or: [{ [a.name]: { addressPostcode: { ilike: "" } } }, { [a.name]: { addressPostcode: { is: "NULL" } } }] }
      ] };
      break;
    case "NUMBER":
      e = { [a.name]: { is: "NULL" } };
      break;
    case "RATING":
      e = { [a.name]: { is: "NULL" } };
      break;
    case "DATE":
    case "DATE_TIME":
      e = { [a.name]: { is: "NULL" } };
      break;
    case "SELECT":
      e = { [a.name]: { is: "NULL" } };
      break;
    case "UUID":
      e = { [a.name]: { is: "NULL" } };
      break;
    case "MULTI_SELECT":
      e = { or: [{ [a.name]: { is: "NULL" } }, { [a.name]: { isEmptyArray: !0 } }] };
      break;
    case "RELATION":
      e = { [a.name + "Id"]: { is: "NULL" } };
      break;
    case "ACTOR":
      e = { or: [{ [a.name]: { name: { ilike: "" } } }, { [a.name]: { name: { is: "NULL" } } }] };
      break;
    case "ARRAY":
      e = { or: [{ [a.name]: { is: "NULL" } }, { [a.name]: { isEmptyArray: !0 } }] };
      break;
    case "FILES":
    case "RAW_JSON":
      e = { or: [{ [a.name]: { is: "NULL" } }] };
      break;
    case "EMAILS":
      e = E({
        correspondingFieldMetadataItem: a,
        recordFilter: s
      });
      break;
    default:
      throw new k(`Unsupported empty filter type ${m}`, "UNSUPPORTED_EMPTY_FILTER_TYPE");
  }
  switch (N) {
    case r.IS_EMPTY:
      return e;
    case r.IS_NOT_EMPTY:
      return { not: e };
    default:
      throw new k(`Unknown operand ${N} for ${m} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
  }
};
export {
  h as getEmptyRecordGqlOperationFilter
};

//# sourceMappingURL=getEmptyRecordGqlOperationFilter.js.map