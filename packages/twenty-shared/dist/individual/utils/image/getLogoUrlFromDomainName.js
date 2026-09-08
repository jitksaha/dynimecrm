var r = (t) => t ? t.replace(/(https?:\/\/)|(www\.)/g, "").replace(/\/$/, "") : "", o = (t) => {
  const e = r(t);
  return e ? `https://twenty-icons.com/${e}` : void 0;
};
export {
  o as getLogoUrlFromDomainName,
  r as sanitizeURL
};

//# sourceMappingURL=getLogoUrlFromDomainName.js.map