import { isObject as r } from "@sniptt/guards";
var c = (o, n = []) => {
  const t = [];
  if (!r(o)) return t;
  for (const [u, e] of Object.entries(o)) {
    if (!r(e)) continue;
    const i = [...n, u];
    t.push(i.join(".")), !e.isLeaf && r(e.value) && t.push(...c(e.value, i));
  }
  return t;
};
export {
  c as collectOutputSchemaPaths
};

//# sourceMappingURL=collect-output-schema-paths.js.map