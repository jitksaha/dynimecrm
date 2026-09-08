var f = (e, l) => {
  const r = e.length + 1, i = l.length + 1, t = Array.from({ length: r }, () => new Array(i).fill(0));
  for (let n = 0; n < r; n++) t[n][0] = n;
  for (let n = 0; n < i; n++) t[0][n] = n;
  for (let n = 1; n < r; n++) for (let o = 1; o < i; o++) {
    const c = e[n - 1] === l[o - 1] ? 0 : 1;
    t[n][o] = Math.min(t[n - 1][o] + 1, t[n][o - 1] + 1, t[n - 1][o - 1] + c);
  }
  return t[e.length][l.length];
};
export {
  f as getEditDistance
};

//# sourceMappingURL=get-edit-distance.util.js.map