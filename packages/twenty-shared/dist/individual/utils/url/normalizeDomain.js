var t = /^[a-z][a-z0-9+.-]*:\/\//i, a = /[/\\?#]/, n = /^.*@/, i = /:\d+$/, E = (e) => {
  const r = e.split(".");
  for (; r.length > 0 && r[r.length - 1] === ""; ) r.pop();
  for (; r[0] === "www"; ) r.shift();
  return r.join(".");
}, l = (e) => {
  try {
    return new URL(`https://${e}`).hostname;
  } catch {
    return e;
  }
}, o = (e) => l(E(e.trim().replace(t, "").split(a)[0].replace(n, "").replace(i, "").toLowerCase()));
export {
  o as normalizeDomain
};

//# sourceMappingURL=normalizeDomain.js.map