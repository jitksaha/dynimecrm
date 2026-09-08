import { isValidUuid as e } from "../../../validation/isValidUuid.js";
import { isValidVariable as t } from "../../../validation/isValidVariable.js";
import { z as i } from "zod";
var s = i.preprocess((r) => {
  try {
    if (typeof r == "string") {
      if (t(r)) return [r];
      try {
        const a = JSON.parse(r);
        return Array.isArray(a) ? a : [a];
      } catch {
        return [r];
      }
    }
    return Array.isArray(r) ? r : [r];
  } catch {
    return [];
  }
}, i.array(i.string().refine((r) => e(r) || t(r), "Must be a valid UUID or a variable with {{ }} syntax"))), y = s.catch([]);
export {
  y as arrayOfUuidOrVariableSchema,
  s as strictArrayOfUuidOrVariableSchema
};

//# sourceMappingURL=arrayOfUuidsOrVariablesSchema.js.map