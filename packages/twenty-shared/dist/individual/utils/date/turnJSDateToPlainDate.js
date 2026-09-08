import { Temporal as t } from "temporal-polyfill";
var a = (r) => t.PlainDate.from({
  day: r.getDate(),
  month: r.getMonth() + 1,
  year: r.getFullYear()
});
export {
  a as turnJSDateToPlainDate
};

//# sourceMappingURL=turnJSDateToPlainDate.js.map