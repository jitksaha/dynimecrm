import { CustomError as i } from "../errors/CustomError.js";
import { isNonEmptyString as m } from "@sniptt/guards";
var s = ({ recordFilter: n, correspondingFieldMetadataItem: r }) => {
  const L = n.subFieldName;
  if (m(L)) switch (L) {
    case "primaryLinkLabel":
      return { or: [{ [r.name]: { primaryLinkLabel: { eq: "" } } }, { [r.name]: { primaryLinkLabel: { is: "NULL" } } }] };
    case "primaryLinkUrl":
      return { or: [{ [r.name]: { primaryLinkUrl: { eq: "" } } }, { [r.name]: { primaryLinkUrl: { is: "NULL" } } }] };
    case "secondaryLinks":
      return { or: [{ [r.name]: { secondaryLinks: { is: "NULL" } } }, { [r.name]: { secondaryLinks: { like: "[]" } } }] };
    default:
      throw new i(`Unknown subfield name ${L}`, "UNKNOWN_SUBFIELD_NAME");
  }
  return { and: [
    { or: [{ [r.name]: { primaryLinkLabel: { eq: "" } } }, { [r.name]: { primaryLinkLabel: { is: "NULL" } } }] },
    { or: [{ [r.name]: { primaryLinkUrl: { eq: "" } } }, { [r.name]: { primaryLinkUrl: { is: "NULL" } } }] },
    { or: [{ [r.name]: { secondaryLinks: { is: "NULL" } } }, { [r.name]: { secondaryLinks: { like: "[]" } } }] }
  ] };
};
export {
  s as computeEmptyGqlOperationFilterForLinks
};

//# sourceMappingURL=computeEmptyGqlOperationFilterForLinks.js.map