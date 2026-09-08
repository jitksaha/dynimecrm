import { CustomError as r } from "../errors/CustomError.js";
import { isNonEmptyString as l } from "@sniptt/guards";
var s = ({ recordFilter: a, correspondingFieldMetadataItem: i }) => {
  const m = a.subFieldName;
  if (l(m)) switch (m) {
    case "primaryEmail":
      return { or: [{ [i.name]: { primaryEmail: { eq: "" } } }, { [i.name]: { primaryEmail: { is: "NULL" } } }] };
    case "additionalEmails":
      return { or: [{ [i.name]: { additionalEmails: { is: "NULL" } } }, { [i.name]: { additionalEmails: { like: "[]" } } }] };
    default:
      throw new r(`Unknown subfield name ${m}`, "UNKNOWN_SUBFIELD_NAME");
  }
  return { and: [{ or: [{ [i.name]: { primaryEmail: { eq: "" } } }, { [i.name]: { primaryEmail: { is: "NULL" } } }] }, { or: [{ [i.name]: { additionalEmails: { is: "NULL" } } }, { [i.name]: { additionalEmails: { like: "[]" } } }] }] };
};
export {
  s as computeEmptyGqlOperationFilterForEmails
};

//# sourceMappingURL=computeEmptyGqlOperationFilterForEmails.js.map