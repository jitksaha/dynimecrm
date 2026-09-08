import { isDefined as u } from "../../../validation/isDefined.js";
import { getFilterTypeFromFieldType as a } from "../getFilterTypeFromFieldType.js";
import { isRecordFilterValueValid as f } from "../../isRecordFilterValueValid.js";
import { FILTER_VALUE_FORMAT_HINTS as n } from "./filterValueSchemasMap.js";
import { getFilterValueSchema as c } from "./getFilterValueSchema.js";
import { convertViewFilterValueToString as F } from "../convertViewFilterValueToString.js";
var S = ({ fieldType: o, operand: e, subFieldName: l, value: m }) => {
  const r = F(m);
  if (!f({
    operand: e,
    value: r
  })) return;
  const t = a(o), i = c({
    filterType: t,
    operand: e,
    subFieldName: l
  });
  if (!u(i)) return;
  const s = i.safeParse(r);
  if (!s.success)
    return {
      stringifiedValue: r,
      operand: e,
      filterType: t,
      hint: n[e] ?? s.error.issues[0]?.message ?? ""
    };
};
export {
  S as getFilterValueValidationIssue
};

//# sourceMappingURL=getFilterValueValidationIssue.js.map