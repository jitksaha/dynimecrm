import { CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX as o } from "../../constants/CaptureAllVariableTagInnerRegex.js";
import { isObject as i, isString as a } from "@sniptt/guards";
function* e(r) {
  if (a(r)) {
    for (const [, t] of r.matchAll(o)) yield t;
    return;
  }
  if (i(r)) for (const t of Object.values(r)) yield* e(t);
}
var s = (r) => [...e(r)];
export {
  s as extractVariablesFromInput
};

//# sourceMappingURL=extract-variables-from-input.util.js.map