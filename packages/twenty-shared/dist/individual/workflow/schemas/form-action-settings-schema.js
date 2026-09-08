import { FieldMetadataType as r } from "../../types/FieldMetadataType.js";
import { baseWorkflowActionSettingsSchema as e } from "./base-workflow-action-settings-schema.js";
import { z as t } from "zod";
var l = e.extend({ input: t.array(t.object({
  id: t.string(),
  name: t.string(),
  label: t.string(),
  type: t.union([
    t.literal(r.TEXT),
    t.literal(r.NUMBER),
    t.literal(r.DATE),
    t.literal(r.SELECT),
    t.literal(r.MULTI_SELECT),
    t.literal("RECORD")
  ]),
  placeholder: t.string().optional(),
  settings: t.record(t.string(), t.any()).optional(),
  value: t.any().optional()
})) });
export {
  l as workflowFormActionSettingsSchema
};

//# sourceMappingURL=form-action-settings-schema.js.map