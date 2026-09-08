var i = (r) => {
  let e = r;
  if (typeof r == "string") try {
    e = JSON.parse(r);
  } catch {
    e = r;
  }
  return new URLSearchParams(e).toString();
}, p = (r) => {
  const e = new FormData();
  if (typeof r == "string") try {
    const t = JSON.parse(r);
    Object.entries(t).forEach(([n, s]) => e.append(n, String(s)));
  } catch {
    throw new Error("String data for FormData must be valid JSON");
  }
  else Object.entries(r).forEach(([t, n]) => e.append(t, n));
  return e;
}, o = (r) => typeof r == "string" ? r : JSON.stringify(r), a = (r) => typeof r == "string" ? r : Object.entries(r).map(([e, t]) => `${e}=${t}`).join(`
`), c = (r, e) => {
  if (e === void 0) return o(r);
  switch (e) {
    case "application/x-www-form-urlencoded":
      return i(r);
    case "multipart/form-data":
      return p(r);
    case "application/json":
      return o(r);
    case "text/plain":
      return a(r);
    default:
      return o(r);
  }
};
export {
  c as parseDataFromContentType
};

//# sourceMappingURL=parseDataFromContentType.js.map