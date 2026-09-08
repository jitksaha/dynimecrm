import { isNonEmptyString as t } from "@sniptt/guards";
var n = (r) => {
  if (!(!t(r) || r === "system"))
    try {
      return new Intl.DateTimeFormat("en-US", { timeZone: r }), r;
    } catch {
      return;
    }
};
export {
  n as getValidTimeZoneOrUndefined
};

//# sourceMappingURL=getValidTimeZoneOrUndefined.js.map