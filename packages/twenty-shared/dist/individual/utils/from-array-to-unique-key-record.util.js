import { isDefined as i } from "./validation/isDefined.js";
var u = ({ array: n, uniqueKey: e }) => n.reduce((t, r) => {
  const o = r[e];
  if (i(t[o])) throw new Error(`Should never occur, flat array contains twice the same unique key ${r[e]}`);
  return {
    ...t,
    [o]: r
  };
}, {});
export {
  u as fromArrayToUniqueKeyRecord
};

//# sourceMappingURL=from-array-to-unique-key-record.util.js.map