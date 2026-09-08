"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CalendarEventWebhookSyncException () {
        return CalendarEventWebhookSyncException;
    },
    get CalendarEventWebhookSyncExceptionCode () {
        return CalendarEventWebhookSyncExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../utils/custom-exception");
var CalendarEventWebhookSyncExceptionCode = /*#__PURE__*/ function(CalendarEventWebhookSyncExceptionCode) {
    CalendarEventWebhookSyncExceptionCode["CALENDAR_CHANNEL_SYNC_ALREADY_IN_PROGRESS"] = "CALENDAR_CHANNEL_SYNC_ALREADY_IN_PROGRESS";
    return CalendarEventWebhookSyncExceptionCode;
}({});
const getCalendarEventWebhookSyncExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "CALENDAR_CHANNEL_SYNC_ALREADY_IN_PROGRESS":
            return /*i18n*/ {
                id: "IIdxjy",
                message: "The calendar is already syncing."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let CalendarEventWebhookSyncException = class CalendarEventWebhookSyncException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getCalendarEventWebhookSyncExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=calendar-event-webhook-sync.exception.js.map