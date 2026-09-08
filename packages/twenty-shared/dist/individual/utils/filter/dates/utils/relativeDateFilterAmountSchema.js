import e from "zod";
var n = e.union([e.coerce.number().int().positive(), e.literal("undefined")]).transform((i) => i === "undefined" ? void 0 : i);
export {
  n as relativeDateFilterAmountSchema
};

//# sourceMappingURL=relativeDateFilterAmountSchema.js.map