import { TIPTAP_NODE_TYPES as e } from "./tiptap-node-types.js";
var t = {
  [e.DOCUMENT]: {
    renderMode: "children",
    stringAttributes: {}
  },
  [e.PARAGRAPH]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.TEXT]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.HEADING]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.VARIABLE_TAG]: {
    renderMode: "node",
    stringAttributes: { variable: "text" }
  },
  [e.IMAGE]: {
    renderMode: "node",
    stringAttributes: {
      src: "url",
      href: "url",
      alt: "text",
      title: "text"
    }
  },
  [e.BULLET_LIST]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.ORDERED_LIST]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.LIST_ITEM]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.HARD_BREAK]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.SECTION]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.COLUMNS]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.COLUMN]: {
    renderMode: "parent",
    stringAttributes: {}
  },
  [e.BUTTON]: {
    renderMode: "node",
    stringAttributes: { href: "url" }
  },
  [e.DIVIDER]: {
    renderMode: "node",
    stringAttributes: {}
  },
  [e.HTML]: {
    renderMode: "node",
    stringAttributes: { html: "html" }
  }
}, d = (r) => Object.prototype.hasOwnProperty.call(t, r), o = (r) => d(r) && t[r].renderMode === "node";
export {
  t as EMAIL_DOCUMENT_NODE_CATALOG,
  d as isEmailDocumentNodeType,
  o as isRenderedEmailDocumentNodeType
};

//# sourceMappingURL=email-document-node-catalog.js.map