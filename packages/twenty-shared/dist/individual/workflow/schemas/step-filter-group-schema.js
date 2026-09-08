import { StepLogicalOperator as o } from "../../types/StepFilters.js";
import { z as r } from "zod";
var e = r.object({
  id: r.string(),
  logicalOperator: r.enum(o),
  parentStepFilterGroupId: r.string().optional(),
  positionInStepFilterGroup: r.number().optional()
});
export {
  e as stepFilterGroupSchema
};

//# sourceMappingURL=step-filter-group-schema.js.map