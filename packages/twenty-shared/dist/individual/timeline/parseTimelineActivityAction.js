import { isTimelineActivityAction as e } from "./TimelineActivityAction.js";
var o = (t) => {
  const i = t?.split(".")[1];
  return e(i) ? i : "linked";
};
export {
  o as parseTimelineActivityAction
};

//# sourceMappingURL=parseTimelineActivityAction.js.map