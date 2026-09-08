import { isDefined as o } from "../../utils/validation/isDefined.js";
import { CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX as i } from "../constants/CaptureAllVariableTagInnerRegex.js";
var d = ({ rawVariableName: a, part: t }) => {
  const e = a.replace(i, (l, n) => n).split("."), r = t === "stepId" ? e[0] : t === "selectedField" ? e[e.length - 1] : null;
  if (!o(r)) throw new Error("Expected to find at least one splitted chunk.");
  return r;
};
export {
  d as extractRawVariableNamePart
};

//# sourceMappingURL=extractRawVariableNameParts.js.map