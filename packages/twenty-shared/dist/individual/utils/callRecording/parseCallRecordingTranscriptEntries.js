import { isDefined as i } from "../validation/isDefined.js";
import { isArray as n, isNumber as o, isObject as d, isString as p, isUndefined as c } from "@sniptt/guards";
var t = (r) => d(r) && !n(r) ? r : void 0, s = (r) => {
  const e = r?.relative;
  return o(e) && Number.isFinite(e) ? e : void 0;
}, a = (r) => {
  const e = p(r) ? r.trim() : "";
  return e === "" ? void 0 : e;
}, f = (r) => {
  const e = a(r.text);
  if (!c(e))
    return {
      text: e,
      startSeconds: s(t(r.start_timestamp)),
      endSeconds: s(t(r.end_timestamp))
    };
}, v = (r) => a(r?.name), l = (r) => {
  if (!n(r.words)) return;
  const e = r.words.map(t).filter(i).map(f).filter(i);
  if (e.length !== 0)
    return {
      speakerName: v(t(r.participant)),
      startSeconds: e[0].startSeconds,
      endSeconds: e[e.length - 1].endSeconds,
      text: e.map((m) => m.text).join(" "),
      words: e
    };
}, T = (r) => {
  if (n(r))
    return r.map(t).filter(i).map(l).filter(i);
};
export {
  T as parseCallRecordingTranscriptEntries
};

//# sourceMappingURL=parseCallRecordingTranscriptEntries.js.map