var n = (a, t) => {
  const l = t?.allowIp ?? !0, e = t?.allowLocalhost ?? !0, c = /^(((?!-))(xn--|_)?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.){1,10}(xn--)?([a-z0-9][a-z0-9-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(a), o = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(a), s = a === "localhost" || a === "127.0.0.1";
  return s && !e || o && !l ? !1 : c || s || o;
};
export {
  n as isValidHostname
};

//# sourceMappingURL=isValidHostname.js.map