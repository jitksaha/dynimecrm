import { firstDayOfWeekSchema as t } from "./firstDayOfWeekSchema.js";
import { relativeDateFilterAmountSchema as r } from "./relativeDateFilterAmountSchema.js";
import { relativeDateFilterDirectionSchema as o } from "./relativeDateFilterDirectionSchema.js";
import { relativeDateFilterUnitSchema as n } from "./relativeDateFilterUnitSchema.js";
import i from "zod";
var u = i.object({
  direction: o,
  amount: r.nullish(),
  unit: n,
  timezone: i.string().nullish(),
  firstDayOfTheWeek: t.nullish()
}).refine((e) => !(e.amount === void 0 && e.direction !== "THIS"), { error: "Amount cannot be 'undefined' unless direction is 'THIS'" });
export {
  u as relativeDateFilterSchema
};

//# sourceMappingURL=relativeDateFilterSchema.js.map