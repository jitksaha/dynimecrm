var e = [
  "http:",
  "https:",
  "mailto:",
  "tel:"
], s = (t) => {
  if (t.startsWith("/") && !t.startsWith("//")) return !0;
  try {
    const r = new URL(t);
    return e.includes(r.protocol);
  } catch {
    return !1;
  }
};
export {
  s as isSafeUrl
};

//# sourceMappingURL=isSafeUrl.js.map