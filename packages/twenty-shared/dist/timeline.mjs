import { t as e } from "./isDefined-Dtu5EYqP.mjs";
//#region src/timeline/TimelineActivityAction.ts
var t = [
	"created",
	"updated",
	"deleted",
	"restored",
	"linked",
	"unlinked"
], n = (n) => e(n) && t.includes(n), r = (e) => {
	let t = e?.split(".")[1];
	return n(t) ? t : "linked";
}, i = {
	message: "8b4da8ed-4a87-480d-bcad-a791262cb890",
	calendarEvent: "3c70dd28-42f3-41da-8f41-22013d65ff50"
}, a = (e) => Object.values(i).includes(e);
//#endregion
export { i as STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS, t as TIMELINE_ACTIVITY_ACTIONS, a as isStandardTimelineActivityRendererUniversalIdentifier, n as isTimelineActivityAction, r as parseTimelineActivityAction };
