import { ViewFilterOperand as i } from "../../../../types/ViewFilterOperand.js";
import { CustomError as E } from "../../../errors/CustomError.js";
import { isNonEmptyString as N } from "@sniptt/guards";
var w = ({ recordFilter: a, correspondingFieldMetadataItem: n, subFieldName: m }) => {
  if (N(m)) switch (m) {
    case "primaryEmail":
      switch (a.operand) {
        case i.CONTAINS:
          return { [n.name]: { primaryEmail: { ilike: `%${a.value}%` } } };
        case i.DOES_NOT_CONTAIN:
          return { not: { [n.name]: { primaryEmail: { ilike: `%${a.value}%` } } } };
        default:
          throw new Error(`Unknown operand ${a.operand} for ${n.type} filter`);
      }
    case "additionalEmails":
      switch (a.operand) {
        case i.CONTAINS:
          return { [n.name]: { additionalEmails: { like: `%${a.value}%` } } };
        case i.DOES_NOT_CONTAIN:
          return { or: [{ not: { [n.name]: { additionalEmails: { like: `%${a.value}%` } } } }, { [n.name]: { additionalEmails: { is: "NULL" } } }] };
        default:
          throw new E(`Unknown operand ${a.operand} for ${n.type} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
      }
    default:
      throw new E(`Unknown subfield name ${m}`, "UNKNOWN_SUBFIELD_NAME");
  }
  switch (a.operand) {
    case i.CONTAINS:
      return { or: [{ [n.name]: { primaryEmail: { ilike: `%${a.value}%` } } }, { [n.name]: { additionalEmails: { like: `%${a.value}%` } } }] };
    case i.DOES_NOT_CONTAIN:
      return { and: [{ not: { [n.name]: { primaryEmail: { ilike: `%${a.value}%` } } } }, { or: [{ not: { [n.name]: { additionalEmails: { like: `%${a.value}%` } } } }, { [n.name]: { additionalEmails: { is: "NULL" } } }] }] };
    default:
      throw new Error(`Unknown operand ${a.operand} for ${n.type} filter`);
  }
};
export {
  w as computeGqlOperationFilterForEmails
};

//# sourceMappingURL=computeGqlOperationFilterForEmails.js.map