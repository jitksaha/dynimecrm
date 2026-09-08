var t = (s, m, e) => s.length !== m.length || s.some((o) => !m.some((n) => n[e] === o[e])) || m.some((o) => !s.some((n) => n[e] === o[e]));
export {
  t as compareArraysOfObjectsByProperty
};

//# sourceMappingURL=compareArraysOfObjectsByProperty.js.map