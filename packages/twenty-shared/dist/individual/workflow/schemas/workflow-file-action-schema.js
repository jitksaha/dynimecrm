import { isValidUuid as e } from "../../utils/validation/isValidUuid.js";
import { z as r } from "zod";
var m = r.object({
  id: r.string().refine((i) => e(i)),
  name: r.string(),
  size: r.number(),
  type: r.string(),
  createdAt: r.string()
});
export {
  m as workflowFileSchema
};

//# sourceMappingURL=workflow-file-action-schema.js.map