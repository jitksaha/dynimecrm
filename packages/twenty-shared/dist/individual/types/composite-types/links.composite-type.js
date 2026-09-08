import { FieldMetadataType as e } from "../FieldMetadataType.js";
var a = {
  type: e.LINKS,
  properties: [
    {
      name: "primaryLinkLabel",
      type: e.TEXT,
      hidden: !1,
      isRequired: !1
    },
    {
      name: "primaryLinkUrl",
      type: e.TEXT,
      hidden: !1,
      isRequired: !1,
      isIncludedInUniqueConstraint: !0
    },
    {
      name: "secondaryLinks",
      type: e.RAW_JSON,
      hidden: !1,
      isRequired: !1
    }
  ]
};
export {
  a as linksCompositeType
};

//# sourceMappingURL=links.composite-type.js.map