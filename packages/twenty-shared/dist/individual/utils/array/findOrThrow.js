import { assertIsDefinedOrThrow as t } from "../validation/assertIsDefinedOrThrow.js";
var s = (e, n, o = /* @__PURE__ */ new Error("Element not found")) => {
  const r = e.find(n);
  return t(r, o), r;
};
export {
  s as findOrThrow
};

//# sourceMappingURL=findOrThrow.js.map