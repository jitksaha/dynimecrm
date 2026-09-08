import { Temporal as e } from "temporal-polyfill";
var i = (a) => (o, t) => {
  const r = e.PlainDate.compare(o, t);
  return r === 0 ? 0 : a === "asc" ? r : -r;
};
export {
  i as sortPlainDate
};

//# sourceMappingURL=sortPlainDate.js.map