import { isDefined as o } from "../validation/isDefined.js";
import { EMAIL_DOCUMENT_MARK_CATALOG as y, isEmailDocumentMarkType as u } from "./email-document-mark-catalog.js";
import { EMAIL_DOCUMENT_NODE_CATALOG as f, isEmailDocumentNodeType as l } from "./email-document-node-catalog.js";
var c = (e, i, s) => o(e) ? Object.entries(i).reduce((n, [r, t]) => {
  const p = n[r];
  return typeof p == "string" && o(t) ? {
    ...n,
    [r]: s(p, t)
  } : n;
}, e) : e, A = (e, i) => {
  const s = l(e.type) ? f[e.type] : void 0, n = c(e.attrs, s?.stringAttributes ?? {}, i), r = e.marks?.map((t) => typeof t != "object" || t === null || !("type" in t) || typeof t.type != "string" || !u(t.type) ? t : {
    ...t,
    ..."attrs" in t && typeof t.attrs == "object" && t.attrs !== null && { attrs: c(t.attrs, y[t.type].stringAttributes, i) }
  });
  return {
    ...e,
    ...typeof e.text == "string" && { text: i(e.text, "text") },
    ...n && { attrs: n },
    ...r && { marks: r },
    ...e.content && { content: e.content.map((t) => A(t, i)) }
  };
};
export {
  A as transformEmailDocumentStrings
};

//# sourceMappingURL=transform-email-document-strings.js.map