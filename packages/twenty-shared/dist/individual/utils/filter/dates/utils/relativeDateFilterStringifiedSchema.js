import { relativeDateFilterSchema as f } from "./relativeDateFilterSchema.js";
import { isNonEmptyArray as d } from "@sniptt/guards";
import r from "zod";
var l = /((?:THIS)|(?:PAST)|(?:NEXT))_(\d*)_(DAY|MONTH|YEAR|WEEK|QUARTER|HOUR|MINUTE|SECOND)(?:(?:;;([^;;]*);;)?(?:(MONDAY|SUNDAY|SATURDAY);;)?)?/, u = r.string().transform((e, t) => {
  const i = new RegExp(l).exec(e);
  if (!d(i))
    return t.addIssue(`Cannot parse stringified inline relative date filter, value : "${e}"`), r.NEVER;
  const [m, n, s, E, o, R] = i, a = f.safeParse({
    direction: n,
    amount: s,
    unit: E,
    timezone: o,
    firstDayOfTheWeek: R
  });
  return a.success ? a.data : (t.addIssue(`Cannot parse stringified inline relative date filter, value : "${e}"`), r.NEVER);
});
export {
  u as relativeDateFilterStringifiedSchema
};

//# sourceMappingURL=relativeDateFilterStringifiedSchema.js.map