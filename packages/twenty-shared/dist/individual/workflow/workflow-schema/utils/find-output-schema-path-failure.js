import { isDefined as s } from "../../../utils/validation/isDefined.js";
import { isObject as c } from "@sniptt/guards";
var t = ({ schema: a, propertyPath: i }) => {
  let l = a;
  for (let e = 0; e < i.length; e++) {
    if (!c(l)) return {
      validPrefix: i.slice(0, e),
      failedSegment: i[e],
      availableKeys: []
    };
    const n = i[e], f = l[n];
    if (!s(f)) return {
      validPrefix: i.slice(0, e),
      failedSegment: n,
      availableKeys: Object.keys(l)
    };
    if (f.isLeaf)
      return e !== i.length - 1 ? {
        validPrefix: i.slice(0, e + 1),
        failedSegment: i[e + 1],
        availableKeys: []
      } : void 0;
    l = f.value;
  }
};
export {
  t as findOutputSchemaPathFailure
};

//# sourceMappingURL=find-output-schema-path-failure.js.map