var f = (a, i) => {
  if (!a) return i;
  if (!i) return a;
  const e = { ...a };
  return Object.keys(i).forEach((t) => {
    const n = a[t], r = i[t];
    if (r !== void 0) {
      if (r === null) {
        e[t] = null;
        return;
      }
      if (Array.isArray(n) && Array.isArray(r)) {
        e[t] = [...n, ...r];
        return;
      }
      if (r instanceof Date || r instanceof RegExp || n instanceof Date || n instanceof RegExp) {
        e[t] = r;
        return;
      }
      if (n && r && typeof n == "object" && typeof r == "object" && !Array.isArray(n) && !Array.isArray(r)) {
        e[t] = f(n, r);
        return;
      }
      e[t] = r;
    }
  }), e;
};
export {
  f as deepMerge
};

//# sourceMappingURL=deepMerge.js.map