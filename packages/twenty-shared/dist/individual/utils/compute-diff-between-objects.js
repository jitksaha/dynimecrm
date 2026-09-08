import { isDefined as m } from "./validation/isDefined.js";
import { fastDeepEqual as u } from "./json/fast-deep-equal.js";
var p = (i, o) => o.reduce((r, t) => ({
  ...r,
  [t]: i[t]
}), {}), v = ({ existingObjects: i, receivedObjects: o, propertiesToCompare: r, isEntityIncluded: t }) => {
  const a = [], n = [], f = [], c = new Map(i.map((e) => [e.id, e])), d = new Map(o.map((e) => [e.id, e]));
  for (const e of o) {
    const s = c.get(e.id);
    m(s) ? t(s) ? u(p(s, r), p(e, r)) || n.push(e) : f.push(e) : a.push(e);
  }
  return {
    toCreate: a,
    toUpdate: n,
    toRestoreAndUpdate: f,
    idsToRemove: i.filter((e) => t(e)).filter((e) => !d.has(e.id)).map((e) => e.id)
  };
};
export {
  v as computeDiffBetweenObjects
};

//# sourceMappingURL=compute-diff-between-objects.js.map