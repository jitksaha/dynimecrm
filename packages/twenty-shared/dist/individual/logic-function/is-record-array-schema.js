import { isRecordObjectSchema as e } from "./is-record-object-schema.js";
import { isNonEmptyString as t } from "@sniptt/guards";
var p = (r) => r?.type === "records" && t(r.objectUniversalIdentifier) || r?.type === "array" && e(r?.items);
export {
  p as isRecordArraySchema
};

//# sourceMappingURL=is-record-array-schema.js.map