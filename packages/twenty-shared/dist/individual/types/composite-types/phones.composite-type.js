import { FieldMetadataType as e } from "../FieldMetadataType.js";
var n = {
  type: e.PHONES,
  properties: [
    {
      name: "primaryPhoneNumber",
      type: e.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "primaryPhoneCountryCode",
      type: e.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "primaryPhoneCallingCode",
      type: e.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "additionalPhones",
      type: e.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
};
export {
  n as phonesCompositeType
};

//# sourceMappingURL=phones.composite-type.js.map