import { EXCLUDED_FIELD_NAMES_FROM_AGENT_TOOL_SCHEMA as u } from "../../constants/ExcludedFieldNamesFromAgentToolSchema.js";
var i = ({ fieldName: d, isSystem: o, excludeId: r = !0, additionalExcludedFieldNames: l = [] }) => {
  const e = [...u, ...l];
  return r && e.push("id"), e.includes(d) || o;
};
export {
  i as shouldExcludeFieldFromAgentToolSchema
};

//# sourceMappingURL=shouldExcludeFieldFromAgentToolSchema.js.map