import { relativeDateFilterSchema as a } from "./filter/dates/utils/relativeDateFilterSchema.js";
var i = (r) => {
  try {
    const t = JSON.parse(r), e = a.safeParse(t);
    return e.success ? e.data : void 0;
  } catch {
    return;
  }
};
export {
  i as safeParseRelativeDateFilterJsonStringified
};

//# sourceMappingURL=safeParseRelativeDateFilterJsonStringified.js.map