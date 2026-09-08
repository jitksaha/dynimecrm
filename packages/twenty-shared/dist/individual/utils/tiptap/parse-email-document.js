import { EMAIL_DOCUMENT_SCHEMA_VERSION as t } from "./email-document-schema-version.js";
import { emailDocumentSchema as a } from "./email-document-schema.js";
var c = (r) => {
  const e = a.safeParse(r);
  return e.success ? {
    success: !0,
    document: e.data
  } : {
    success: !1,
    error: e.error.issues.slice(0, 10).map((s) => `${s.path.join(".")}: ${s.message}`).join("; ")
  };
}, u = (r) => {
  const e = c(r);
  return e.success && e.document.attrs?.schemaVersion !== t ? {
    success: !1,
    error: `attrs.schemaVersion: Expected ${t}`
  } : e;
};
export {
  u as parseCanonicalEmailDocument,
  c as parseEmailDocument
};

//# sourceMappingURL=parse-email-document.js.map