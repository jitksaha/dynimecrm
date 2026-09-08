import { z as e } from "zod";
var m = e.email({ pattern: e.regexes.unicodeEmail }).max(255);
export {
  m as emailSchema
};

//# sourceMappingURL=emailSchema.js.map