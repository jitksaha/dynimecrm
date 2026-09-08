import { FieldMetadataType as o } from "../FieldMetadataType.js";
import { actorCompositeType as p } from "./actor.composite-type.js";
import { addressCompositeType as e } from "./address.composite-type.js";
import { currencyCompositeType as m } from "./currency.composite-type.js";
import { emailsCompositeType as i } from "./emails.composite-type.js";
import { fullNameCompositeType as r } from "./full-name.composite-type.js";
import { linksCompositeType as t } from "./links.composite-type.js";
import { phonesCompositeType as s } from "./phones.composite-type.js";
import { richTextCompositeType as T } from "./rich-text.composite-type.js";
var R = /* @__PURE__ */ new Map([
  [o.LINKS, t],
  [o.CURRENCY, m],
  [o.FULL_NAME, r],
  [o.ADDRESS, e],
  [o.ACTOR, p],
  [o.EMAILS, i],
  [o.PHONES, s],
  [o.RICH_TEXT, T]
]);
export {
  R as compositeTypeDefinitions
};

//# sourceMappingURL=composite-type-definitions.js.map