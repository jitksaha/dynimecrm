var i = (t, r) => {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    if (Array.isArray(t)) {
      const e = t, n = r;
      if (e.length !== n.length) return !1;
      for (let f = e.length; f-- !== 0; ) if (!i(e[f], n[f])) return !1;
      return !0;
    }
    if (t instanceof Map && r instanceof Map) {
      if (t.size !== r.size) return !1;
      for (const [e] of t.entries()) if (!r.has(e)) return !1;
      for (const [e, n] of t.entries()) if (!i(n, r.get(e))) return !1;
      return !0;
    }
    if (t instanceof Set && r instanceof Set) {
      if (t.size !== r.size) return !1;
      for (const e of t) if (!r.has(e)) return !1;
      return !0;
    }
    if (ArrayBuffer.isView(t) && ArrayBuffer.isView(r)) {
      const e = t, n = r;
      if (e.length !== n.length) return !1;
      for (let f = e.length; f-- !== 0; ) if (e[f] !== n[f]) return !1;
      return !0;
    }
    if (t.constructor === RegExp) {
      const e = t, n = r;
      return e.source === n.source && e.flags === n.flags;
    }
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    const o = Object.keys(t), g = Object.keys(r);
    if (o.length !== g.length) return !1;
    for (let e = o.length; e-- !== 0; ) if (!(o[e] in r)) return !1;
    for (let e = o.length; e-- !== 0; ) {
      const n = o[e];
      if (!i(t[n], r[n])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
};
export {
  i as fastDeepEqual
};

//# sourceMappingURL=fast-deep-equal.js.map