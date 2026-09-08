import { ViewFilterOperand as t } from "../../types/ViewFilterOperand.js";
import { ViewFilterOperandDeprecated as r } from "../../types/ViewFilterOperandDeprecated.js";
import { z as e } from "zod";
var n = e.object({
  id: e.string(),
  type: e.string(),
  stepOutputKey: e.string(),
  operand: e.enum(t).or(e.enum(r)),
  value: e.string(),
  stepFilterGroupId: e.string(),
  positionInStepFilterGroup: e.number().optional(),
  fieldMetadataId: e.string().optional(),
  compositeFieldSubFieldName: e.string().optional()
});
export {
  n as stepFilterSchema
};

//# sourceMappingURL=step-filter-schema.js.map