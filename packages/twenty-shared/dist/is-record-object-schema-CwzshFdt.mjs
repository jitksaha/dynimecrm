import { isNonEmptyString as e } from "@sniptt/guards";
//#region src/logic-function/is-record-object-schema.ts
var t = (t) => (t?.type === "record" || t?.type === "object") && e(t.objectUniversalIdentifier);
//#endregion
export { t };
