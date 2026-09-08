import { absoluteUrlSchema as t } from "./absoluteUrlSchema.js";
var o = (e) => {
  const r = t.safeParse(e);
  if (!r.success) throw new Error("Invalid URL");
  try {
    return new URL(r.data).hostname;
  } catch {
    throw new Error("Invalid URL");
  }
};
export {
  o as getUrlHostnameOrThrow
};

//# sourceMappingURL=getUrlHostnameOrThrow.js.map