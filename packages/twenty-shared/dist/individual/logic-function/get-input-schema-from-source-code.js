import { isDefined as o } from "../utils/validation/isDefined.js";
import { DEFAULT_TOOL_INPUT_SCHEMA as p } from "./constants/DefaultToolInputSchema.js";
var c = async (e) => {
  const { getFunctionInputSchema: r } = await import("./get-function-input-schema.js"), t = r(e)[0];
  return t?.type === "object" && o(t.properties) ? {
    type: "object",
    properties: t.properties
  } : p;
};
export {
  c as getInputSchemaFromSourceCode
};

//# sourceMappingURL=get-input-schema-from-source-code.js.map