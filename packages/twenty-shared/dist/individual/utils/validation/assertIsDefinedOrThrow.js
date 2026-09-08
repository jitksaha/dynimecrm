import { isDefined as o } from "./isDefined.js";
function n(e, r = /* @__PURE__ */ new Error("Value not defined")) {
  if (!o(e)) throw r;
}
export {
  n as assertIsDefinedOrThrow
};

//# sourceMappingURL=assertIsDefinedOrThrow.js.map