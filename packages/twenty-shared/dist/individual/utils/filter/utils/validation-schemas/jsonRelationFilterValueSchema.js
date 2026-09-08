import { z as e } from "zod";
var a = e.object({
  isCurrentWorkspaceMemberSelected: e.boolean().optional(),
  isCurrentRecordSelected: e.boolean().optional(),
  selectedRecordIds: e.array(e.string())
}), c = e.string().transform((r, t) => {
  try {
    return JSON.parse(r);
  } catch (o) {
    return t.addIssue({
      code: "custom",
      message: o.message
    }), e.NEVER;
  }
}).pipe(a);
export {
  c as jsonRelationFilterValueSchema,
  a as relationFilterValueSchemaObject
};

//# sourceMappingURL=jsonRelationFilterValueSchema.js.map