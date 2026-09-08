import { getLogoUrlFromDomainName as e } from "./getLogoUrlFromDomainName.js";
var s = (r) => {
  const t = (r ?? "").trim();
  if (!t) return;
  const o = t.startsWith("http://") || t.startsWith("https://") ? t : `https://${t}`;
  try {
    const n = new URL(o).hostname;
    return e(n);
  } catch {
    return;
  }
};
export {
  s as getLinkFaviconUrl
};

//# sourceMappingURL=getLinkFaviconUrl.js.map