var r = ({ imageUrl: t, baseUrl: s }) => {
  const e = t.toLowerCase();
  return [
    "http:",
    "https:",
    "data:",
    "blob:"
  ].some((o) => e.startsWith(o)) || t.startsWith("//") ? t : t.startsWith("/") ? new URL(`/files${t}`, s).toString() : new URL(`/files/${t}`, s).toString();
};
export {
  r as getImageAbsoluteURI
};

//# sourceMappingURL=getImageAbsoluteURI.js.map