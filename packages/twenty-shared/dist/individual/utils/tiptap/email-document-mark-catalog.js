import { TIPTAP_MARK_TYPES as t } from "./tiptap-mark-types.js";
var i = {
  [t.BOLD]: { stringAttributes: {} },
  [t.ITALIC]: { stringAttributes: {} },
  [t.UNDERLINE]: { stringAttributes: {} },
  [t.STRIKE]: { stringAttributes: {} },
  [t.LINK]: { stringAttributes: { href: "url" } }
}, s = (r) => Object.prototype.hasOwnProperty.call(i, r);
export {
  i as EMAIL_DOCUMENT_MARK_CATALOG,
  s as isEmailDocumentMarkType
};

//# sourceMappingURL=email-document-mark-catalog.js.map