"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CALENDAR_ONGOING_STALE_SYNC_STAGES", {
    enumerable: true,
    get: function() {
        return CALENDAR_ONGOING_STALE_SYNC_STAGES;
    }
});
const _types = require("twenty-shared/types");
const CALENDAR_ONGOING_STALE_SYNC_STAGES = [
    _types.CalendarChannelSyncStage.CALENDAR_EVENTS_IMPORT_ONGOING,
    _types.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_ONGOING,
    _types.CalendarChannelSyncStage.CALENDAR_EVENTS_IMPORT_SCHEDULED,
    _types.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_SCHEDULED
];

//# sourceMappingURL=calendar-ongoing-stale-sync-stages.constant.js.map