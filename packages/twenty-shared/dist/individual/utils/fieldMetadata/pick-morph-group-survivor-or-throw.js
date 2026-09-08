import { CustomError as h } from "../errors/CustomError.js";
var p = (r) => (r.isActive ? 2 : 0) + (r.isSystem ? 0 : 1), u = (r) => {
  if (r.length === 0) throw new h("pickMorphGroupSurvivorOrThrow requires a non-empty morph group", "EMPTY_MORPH_GROUP");
  return r.reduce((o, e) => {
    const i = p(e) - p(o);
    return i > 0 || i === 0 && e.id < o.id ? e : o;
  });
};
export {
  u as pickMorphGroupSurvivorOrThrow
};

//# sourceMappingURL=pick-morph-group-survivor-or-throw.js.map