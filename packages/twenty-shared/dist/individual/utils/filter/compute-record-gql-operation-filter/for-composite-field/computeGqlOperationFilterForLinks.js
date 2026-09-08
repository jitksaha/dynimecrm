import { ViewFilterOperand as L } from "../../../../types/ViewFilterOperand.js";
import { CustomError as u } from "../../../errors/CustomError.js";
import { isNonEmptyString as N } from "@sniptt/guards";
var $ = ({ recordFilter: n, correspondingFieldMetadataItem: k, subFieldName: a }) => {
  if (N(a)) switch (a) {
    case "primaryLinkLabel":
    case "primaryLinkUrl":
      switch (n.operand) {
        case L.CONTAINS:
          return { [k.name]: { [a]: { ilike: `%${n.value}%` } } };
        case L.DOES_NOT_CONTAIN:
          return { not: { [k.name]: { [a]: { ilike: `%${n.value}%` } } } };
        default:
          throw new u(`Unknown operand ${n.operand} for ${k.type} filter`, "UNKNOWN_OPERAND_FOR_FILTER");
      }
    case "secondaryLinks":
      switch (n.operand) {
        case L.CONTAINS:
          return { [k.name]: { secondaryLinks: { like: `%${n.value}%` } } };
        case L.DOES_NOT_CONTAIN:
          return { or: [{ not: { [k.name]: { secondaryLinks: { like: `%${n.value}%` } } } }, { [k.name]: { secondaryLinks: { is: "NULL" } } }] };
        default:
          throw new Error(`Unknown operand ${n.operand} for ${k.type} filter`);
      }
    default:
      throw new Error(`Unknown subfield name ${a}`);
  }
  switch (n.operand) {
    case L.CONTAINS:
      return { or: [
        { [k.name]: { primaryLinkUrl: { ilike: `%${n.value}%` } } },
        { [k.name]: { primaryLinkLabel: { ilike: `%${n.value}%` } } },
        { [k.name]: { secondaryLinks: { like: `%${n.value}%` } } }
      ] };
    case L.DOES_NOT_CONTAIN:
      return { and: [
        { not: { [k.name]: { primaryLinkLabel: { ilike: `%${n.value}%` } } } },
        { not: { [k.name]: { primaryLinkUrl: { ilike: `%${n.value}%` } } } },
        { or: [{ not: { [k.name]: { secondaryLinks: { like: `%${n.value}%` } } } }, { [k.name]: { secondaryLinks: { is: "NULL" } } }] }
      ] };
    default:
      throw new Error(`Unknown operand ${n.operand} for ${k.type} filter`);
  }
};
export {
  $ as computeGqlOperationFilterForLinks
};

//# sourceMappingURL=computeGqlOperationFilterForLinks.js.map