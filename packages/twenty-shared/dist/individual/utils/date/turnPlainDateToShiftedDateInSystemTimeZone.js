var o = (t) => {
  const e = Intl.DateTimeFormat().resolvedOptions().timeZone, n = t.toZonedDateTime(e).toInstant().toString();
  return new Date(n);
};
export {
  o as turnPlainDateToShiftedDateInSystemTimeZone
};

//# sourceMappingURL=turnPlainDateToShiftedDateInSystemTimeZone.js.map