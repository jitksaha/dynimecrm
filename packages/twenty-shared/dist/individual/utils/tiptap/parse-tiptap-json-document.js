import { TIPTAP_NODE_TYPES as n } from "./tiptap-node-types.js";
import "./tiptap-document-schema-version.js";
var o = (r) => typeof r == "object" && r !== null && !Array.isArray(r), i = (r) => o(r) ? typeof r.type == "string" && (r.attrs === void 0 || o(r.attrs)) : !1, s = (r) => o(r) ? typeof r.type == "string" && (r.attrs === void 0 || o(r.attrs)) && (r.text === void 0 || typeof r.text == "string") && (r.content === void 0 || Array.isArray(r.content) && r.content.every(s)) && (r.marks === void 0 || Array.isArray(r.marks) && r.marks.every(i)) : !1, p = (r) => s(r) && r.type === n.DOCUMENT, e = (r) => {
  try {
    const t = JSON.parse(r);
    return p(t) ? t : void 0;
  } catch {
    return;
  }
}, y = (r) => {
  const t = e(r);
  return t?.attrs?.schemaVersion === 1 ? t : void 0;
};
export {
  s as isTipTapNode,
  y as parseCanonicalTipTapJsonDocument,
  e as parseTipTapJsonDocument
};

//# sourceMappingURL=parse-tiptap-json-document.js.map