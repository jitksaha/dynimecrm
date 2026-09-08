import { findById as t } from "./findById.js";
var m = (n, e) => {
  const i = n.findIndex(t(e.id));
  if (i > -1) {
    const d = [...n], c = {
      ...n[i],
      ...e
    };
    return d.splice(i, 1, c), d;
  } else return n.concat({ ...e });
};
export {
  m as upsertPropertiesOfItemIntoArrayOfObjectsComparingId
};

//# sourceMappingURL=upsertPropertiesOfItemIntoArrayOfObjectsComparingId.js.map