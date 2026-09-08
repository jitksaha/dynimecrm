import { ensureAbsoluteUrl as a } from "./ensureAbsoluteUrl.js";
import { isValidHostname as m } from "./isValidHostname.js";
import { z as e } from "zod";
var n = e.string().transform((o, r) => {
  const t = a(o.trim()), s = t.replace("https://", "").replace("http://", "").replace("HTTPS://", "").replace("HTTP://", "");
  if (/^\d+(?:\/[a-zA-Z]*)?$/.test(s))
    return r.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), e.NEVER;
  try {
    return m(new URL(t).hostname) ? t : (r.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), e.NEVER);
  } catch {
    return r.addIssue({
      code: "custom",
      message: "domain is not a valid url"
    }), e.NEVER;
  }
});
export {
  n as absoluteUrlSchema
};

//# sourceMappingURL=absoluteUrlSchema.js.map