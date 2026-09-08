var i = /^\d+$/, c = (n) => n.endsWith("FastInstanceCommand") ? "(instance fast)" : n.endsWith("SlowInstanceCommand") ? "(instance slow)" : "(workspace)", d = (n) => n.replace(/FastInstanceCommand$/, "").replace(/SlowInstanceCommand$/, "").replace(/Command$/, ""), l = (n) => {
  const a = n.split("_");
  if (a.length < 3) return n;
  const t = a[0], e = a[a.length - 1], m = i.test(e), r = a.slice(1, -1).join("_"), s = d(r), o = c(r);
  return m ? `${s} ${e} (${t}) ${o}` : `${s} (${t}) ${o}`;
};
export {
  l as formatUpgradeCommandName
};

//# sourceMappingURL=formatUpgradeCommandName.js.map