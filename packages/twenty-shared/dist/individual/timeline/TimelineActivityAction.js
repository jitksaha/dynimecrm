import { isDefined as i } from "../utils/validation/isDefined.js";
var d = [
  "created",
  "updated",
  "deleted",
  "restored",
  "linked",
  "unlinked"
], r = (e) => i(e) && d.includes(e);
export {
  d as TIMELINE_ACTIVITY_ACTIONS,
  r as isTimelineActivityAction
};

//# sourceMappingURL=TimelineActivityAction.js.map