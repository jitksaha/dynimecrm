import { isNonEmptyString as r } from "@sniptt/guards";
var o = (e) => (e?.type === "record" || e?.type === "object") && r(e.objectUniversalIdentifier);
export {
  o as isRecordObjectSchema
};

//# sourceMappingURL=is-record-object-schema.js.map