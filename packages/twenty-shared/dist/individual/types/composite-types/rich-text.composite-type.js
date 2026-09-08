import { FieldMetadataType as e } from "../FieldMetadataType.js";
import { z as a } from "zod";
var r = {
  type: e.RICH_TEXT,
  properties: [{
    name: "blocknote",
    type: e.TEXT,
    hidden: !1,
    isRequired: !1
  }, {
    name: "markdown",
    type: e.TEXT,
    hidden: !1,
    isRequired: !1
  }]
}, i = a.object({
  blocknote: a.string().nullable().optional(),
  markdown: a.string().nullable()
});
export {
  r as richTextCompositeType,
  i as richTextValueSchema
};

//# sourceMappingURL=rich-text.composite-type.js.map