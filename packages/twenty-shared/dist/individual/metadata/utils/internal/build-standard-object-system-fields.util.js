import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER as r } from "../../../application/constants/TwentyStandardApplicationUniversalIdentifier.js";
import { getFieldUniversalIdentifier as i } from "../../../application/deterministic-identifier/get-field-universal-identifier.util.js";
var d = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "createdBy",
  "updatedBy",
  "position",
  "searchVector"
], A = (t) => Object.fromEntries(d.map((e) => [e, { universalIdentifier: i({
  applicationUniversalIdentifier: r,
  objectUniversalIdentifier: t,
  name: e
}) }]));
export {
  A as buildStandardObjectSystemFields
};

//# sourceMappingURL=build-standard-object-system-fields.util.js.map