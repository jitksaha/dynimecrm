import { isNonEmptyString as e } from "@sniptt/guards";
//#region src/utils/strings/capitalize.ts
var t = (t) => e(t) ? t[0].toUpperCase() + t.slice(1) : "";
//#endregion
export { t };
