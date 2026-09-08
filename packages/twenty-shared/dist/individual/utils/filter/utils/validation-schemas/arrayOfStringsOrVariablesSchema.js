import { isValidVariable as s } from "../../../validation/isValidVariable.js";
import { z as t } from "zod";
var n = t.string().transform((r, e) => {
  if (r === "") return [];
  if (s(r)) return [r];
  try {
    return JSON.parse(r);
  } catch (a) {
    return e.addIssue({
      code: "custom",
      message: a.message
    }), t.NEVER;
  }
}).refine((r) => Array.isArray(r) && r.every((e) => typeof e == "string"), { error: "Expected an array of strings" });
export {
  n as arrayOfStringsOrVariablesSchema
};

//# sourceMappingURL=arrayOfStringsOrVariablesSchema.js.map