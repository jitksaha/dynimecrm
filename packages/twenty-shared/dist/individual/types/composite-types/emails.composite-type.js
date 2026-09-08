import { FieldMetadataType as e } from "../FieldMetadataType.js";
var a = {
  type: e.EMAILS,
  properties: [{
    name: "primaryEmail",
    type: e.TEXT,
    hidden: !1,
    isRequired: !1,
    isIncludedInUniqueConstraint: !0
  }, {
    name: "additionalEmails",
    type: e.RAW_JSON,
    hidden: !1,
    isRequired: !1
  }]
};
export {
  a as emailsCompositeType
};

//# sourceMappingURL=emails.composite-type.js.map