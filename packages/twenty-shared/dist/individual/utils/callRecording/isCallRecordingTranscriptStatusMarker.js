import { isArray as t, isObject as a } from "@sniptt/guards";
var i = (r) => {
  if (!a(r) || t(r)) return !1;
  const s = r.status;
  return s === "PENDING" || s === "FAILED";
};
export {
  i as isCallRecordingTranscriptStatusMarker
};

//# sourceMappingURL=isCallRecordingTranscriptStatusMarker.js.map