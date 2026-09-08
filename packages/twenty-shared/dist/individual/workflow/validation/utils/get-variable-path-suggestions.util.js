import { isDefined as c } from "../../../utils/validation/isDefined.js";
import { isPlainObject as m } from "../../../utils/typeguard/isPlainObject.js";
import { getEditDistance as f } from "./get-edit-distance.util.js";
import { isBaseOutputSchemaV2 as p } from "../../workflow-schema/guards/isBaseOutputSchemaV2.js";
import { collectOutputSchemaPaths as h } from "../../workflow-schema/utils/collect-output-schema-paths.js";
import { findOutputSchemaPathFailure as O } from "../../workflow-schema/utils/find-output-schema-path-failure.js";
import { collectOutputSchemaVariablePaths as S } from "../../workflow-schema/utils/resolve-variable-path-in-output-schema.js";
import { isNonEmptyArray as j } from "@sniptt/guards";
var g = 3, s = (i) => m(i) ? i._outputSchemaType === "RECORD" ? !0 : Object.values(i).some((a) => m(a) && s(a.value)) : !1, e = (i, a) => a.map((t) => ({
  candidate: t,
  distance: f(i, t)
})).filter(({ candidate: t, distance: r }) => r <= Math.ceil(t.length / 2)).sort((t, r) => t.distance - r.distance).slice(0, g).map(({ candidate: t }) => t), R = ({ schema: i, propertyPath: a, referencedStepId: t }) => {
  if (!p(i) || s(i)) {
    const o = S(i);
    return e(a.join("."), o).map((u) => [t, u].join("."));
  }
  const r = O({
    schema: i,
    propertyPath: a
  });
  if (!c(r)) return [];
  const n = e(r.failedSegment, r.availableKeys).map((o) => [
    t,
    ...r.validPrefix,
    o
  ].join("."));
  if (j(n)) return n;
  const l = h(i);
  return e(a.join("."), l).map((o) => [t, o].join("."));
};
export {
  R as getVariablePathSuggestions
};

//# sourceMappingURL=get-variable-path-suggestions.util.js.map