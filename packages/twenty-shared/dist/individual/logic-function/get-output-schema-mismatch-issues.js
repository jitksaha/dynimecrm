import { isDefined as n } from "../utils/validation/isDefined.js";
var o = (i, a) => i ? `${i}.${a}` : a, f = (i, a, u = "") => {
  const s = [];
  for (const [p, t] of Object.entries(a)) {
    const c = o(u, p), e = i[p];
    if (!n(e)) {
      s.push(`Missing key "${c}" in declared output schema.`);
      continue;
    }
    if (t.isLeaf !== e.isLeaf) {
      s.push(`Type mismatch at "${c}": expected ${t.isLeaf ? t.type : "object"} but declared ${e.isLeaf ? e.type : "object"}.`);
      continue;
    }
    if (!t.isLeaf && !e.isLeaf) {
      s.push(...f(e.value, t.value, c));
      continue;
    }
    t.isLeaf && e.isLeaf && t.type !== "unknown" && e.type !== "unknown" && t.type !== e.type && s.push(`Type mismatch at "${c}": expected ${t.type} but declared ${e.type}.`);
  }
  return s;
};
export {
  f as getOutputSchemaMismatchIssues
};

//# sourceMappingURL=get-output-schema-mismatch-issues.js.map