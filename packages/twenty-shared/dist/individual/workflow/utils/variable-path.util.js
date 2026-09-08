var s = /[\s[]/, l = (e) => s.test(e), h = (e) => l(e) ? `[${e}]` : e, c = (e) => e.map(h).join("."), u = (e) => {
  const a = [];
  let n = "", i = !1, t = 0;
  for (; t < e.length; ) {
    const r = e[t];
    if (r === "[" && !i) {
      n.length > 0 && (a.push(n), n = ""), i = !0, t++;
      continue;
    }
    if (r === "]" && i) {
      a.push(n), n = "", i = !1, t++, t < e.length && e[t] === "." && t++;
      continue;
    }
    if (r === "." && !i) {
      n.length > 0 && (a.push(n), n = ""), t++;
      continue;
    }
    n += r, t++;
  }
  return n.length > 0 && a.push(n), a;
};
export {
  h as escapePathSegment,
  c as joinVariablePath,
  l as needsEscaping,
  u as parseVariablePath
};

//# sourceMappingURL=variable-path.util.js.map