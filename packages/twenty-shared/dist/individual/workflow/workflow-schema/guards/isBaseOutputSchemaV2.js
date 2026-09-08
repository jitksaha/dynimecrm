import { isDefined as s } from "../../../utils/validation/isDefined.js";
import { isBoolean as f, isObject as t } from "class-validator";
var n = (r) => {
  if (!s(r) || !t(r) || Array.isArray(r)) return !1;
  const i = Object.values(r);
  return i.length === 0 ? !1 : i.every((e) => s(e) && t(e) && f(e.isLeaf));
};
export {
  n as isBaseOutputSchemaV2
};

//# sourceMappingURL=isBaseOutputSchemaV2.js.map