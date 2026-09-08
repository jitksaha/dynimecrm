var n = (t) => {
  const o = t < 0 ? "-" : "", e = Math.abs(t), r = (u, i) => o + u.toFixed(1).replace(/\.?0+$/, "") + i;
  return Number(e.toFixed(1)) < 1e3 ? r(e, "") : Number((e / 1e3).toFixed(1)) < 1e3 ? r(e / 1e3, "k") : Number((e / 1e6).toFixed(1)) < 1e3 ? r(e / 1e6, "m") : r(e / 1e9, "b");
};
export {
  n as formatToShortNumber
};

//# sourceMappingURL=formatToShortNumber.js.map