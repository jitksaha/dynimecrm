import { isDefined as f } from "../utils/validation/isDefined.js";
import { sha256 as i } from "@noble/hashes/sha2";
import { utf8ToBytes as n } from "@noble/hashes/utils";
var m = "", c = 5e4, r = /* @__PURE__ */ new Map(), d = (e) => typeof Buffer < "u" ? Buffer.from(e).toString("base64") : btoa(String.fromCharCode(...e)), h = (e, s = "") => {
  const a = e + m + (s || ""), o = r.get(a);
  if (f(o)) return o;
  const t = d(i(n(a))).slice(0, 6);
  return r.size >= c && r.clear(), r.set(a, t), t;
};
export {
  h as generateMessageId
};

//# sourceMappingURL=generate-message-id.js.map