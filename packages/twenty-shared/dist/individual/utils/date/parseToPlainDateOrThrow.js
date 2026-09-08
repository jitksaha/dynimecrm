import { Temporal as a } from "temporal-polyfill";
var o = (r) => {
  try {
    return a.Instant.from(r).toZonedDateTimeISO("UTC").toPlainDate();
  } catch {
  }
  try {
    return a.PlainDate.from(r);
  } catch {
  }
  throw new Error(`Cannot parse date string as PlainDate : "${r}"`);
};
export {
  o as parseToPlainDateOrThrow
};

//# sourceMappingURL=parseToPlainDateOrThrow.js.map