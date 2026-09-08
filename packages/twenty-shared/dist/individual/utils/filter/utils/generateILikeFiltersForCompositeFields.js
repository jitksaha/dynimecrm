var k = (i, t, n, o = !1) => {
  if (o) return n.map((r) => ({ or: [{ [t]: { [r]: { is: "NULL" } } }, { [t]: { [r]: { ilike: "" } } }] }));
  const e = i.trim().split(/\s+/).filter(Boolean);
  return e.length <= 1 ? n.map((r) => ({ [t]: { [r]: { ilike: `%${e[0] ?? ""}%` } } })) : [{ and: e.map((r) => ({ or: n.map((p) => ({ [t]: { [p]: { ilike: `%${r}%` } } })) })) }];
};
export {
  k as generateILikeFiltersForCompositeFields
};

//# sourceMappingURL=generateILikeFiltersForCompositeFields.js.map