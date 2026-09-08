import { isDefined as u } from "../../../utils/validation/isDefined.js";
var l = ({ schema: i, propertyPath: r }) => {
  if (r.length === 0) return;
  let t = i, e;
  for (const n of r) {
    if (e = t[n], !u(e)) return;
    if (e.isLeaf) return n === r[r.length - 1] ? e : void 0;
    t = e.value;
  }
  return e;
};
export {
  l as navigateOutputSchemaProperty
};

//# sourceMappingURL=navigate-output-schema-property.js.map