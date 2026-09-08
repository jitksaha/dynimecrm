import { findById as r } from "./findById.js";
var f = (n, d) => {
  const e = n.findIndex(r(d.id));
  if (e > -1) {
    const i = [...n];
    return i.splice(e, 1, d), i;
  } else return n.concat(d);
};
export {
  f as upsertIntoArrayOfObjectsComparingId
};

//# sourceMappingURL=upsertIntoArrayOfObjectsComparingId.js.map