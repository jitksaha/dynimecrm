var y = [
  "yyyy.MM.dd",
  "yyyy/MM/dd",
  "MM-dd-yyyy",
  "MM/dd/yyyy",
  "MM.dd.yyyy",
  "MMMM d, yyyy",
  "MMM d, yyyy",
  "d MMMM yyyy",
  "d MMM yyyy",
  "dd-MMM-yyyy",
  "yyyy-MMM-dd"
], M = [
  "yyyy-MM-dd",
  "yyyyMMdd",
  ...y,
  "yyyy-MM-dd'T'HH:mm:ss.SSSX",
  "yyyy-MM-dd'T'HH:mm:ssX",
  "yyyy-MM-dd'T'HH:mm:ss.SSS",
  "yyyy-MM-dd'T'HH:mm:ss",
  "yyyy-MM-dd HH:mm:ss",
  "yyyy-MM-dd HH:mm:ss.SSS"
], d = [
  "yyyy-MM-dd'T'HH:mm:ss.SSSX",
  "yyyy-MM-dd'T'HH:mm:ssX",
  "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  "yyyy-MM-dd'T'HH:mm:ssxxx",
  "yyyy-MM-dd'T'HH:mm:ss.SSS",
  "yyyy-MM-dd'T'HH:mm:ss",
  "yyyy-MM-dd HH:mm:ss.SSS",
  "yyyy-MM-dd HH:mm:ss",
  "yyyy-MM-dd HH:mm",
  "yyyy-MM-dd",
  "yyyyMMdd",
  ...y
];
export {
  M as ACCEPTED_DATE_FORMATS,
  d as ACCEPTED_DATE_TIME_FORMATS,
  y as NON_ISO_DATE_FORMATS
};

//# sourceMappingURL=dateInputFormats.js.map