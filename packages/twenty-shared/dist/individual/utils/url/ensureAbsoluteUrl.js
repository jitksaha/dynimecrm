var s = (r) => {
  const t = r.trim();
  return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("HTTPS://") || t.startsWith("HTTP://") ? t : `https://${t}`;
};
export {
  s as ensureAbsoluteUrl
};

//# sourceMappingURL=ensureAbsoluteUrl.js.map