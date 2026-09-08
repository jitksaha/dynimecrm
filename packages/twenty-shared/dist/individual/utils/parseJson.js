import { isDefined as e } from "./validation/isDefined.js";
var n = (r) => {
  try {
    return !e(r) || r === "" ? null : JSON.parse("[" + r + "]")[0];
  } catch {
    return null;
  }
};
export {
  n as parseJson
};

//# sourceMappingURL=parseJson.js.map