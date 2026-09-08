import { absoluteUrlSchema as t } from "./absoluteUrlSchema.js";
var o = (r) => {
  try {
    return t.parse(r);
  } catch {
    throw new Error("Invalid URL");
  }
};
export {
  o as getAbsoluteUrlOrThrow
};

//# sourceMappingURL=getAbsoluteUrlOrThrow.js.map