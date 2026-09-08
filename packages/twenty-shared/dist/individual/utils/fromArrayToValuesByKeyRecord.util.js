import { isDefined as c } from "./validation/isDefined.js";
var f = ({ array: n, key: u }) => n.reduce((r, e) => {
  const o = e[u], t = r[o];
  return c(t) ? {
    ...r,
    [o]: [...t, e]
  } : {
    ...r,
    [o]: [e]
  };
}, {});
export {
  f as fromArrayToValuesByKeyRecord
};

//# sourceMappingURL=fromArrayToValuesByKeyRecord.util.js.map