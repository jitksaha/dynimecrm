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
    get CalendarEventCreationException () {
        return CalendarEventCreationException;
    },
    get CalendarEventCreationExceptionCode () {
        return CalendarEventCreationExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var CalendarEventCreationExceptionCode = /*#__PURE__*/ function(CalendarEventCreationExceptionCode) {
    CalendarEventCreationExceptionCode["PROVIDER_NOT_SUPPORTED"] = "PROVIDER_NOT_SUPPORTED";
    CalendarEventCreationExceptionCode["PROVIDER_REQUEST_FAILED"] = "PROVIDER_REQUEST_FAILED";
    return CalendarEventCreationExceptionCode;
}({});
const getCalendarEventCreationExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "PROVIDER_NOT_SUPPORTED":
            return /*i18n*/ {
                id: "OMhck0",
                message: "Calendar event creation is not supported for this account."
            };
        case "PROVIDER_REQUEST_FAILED":
            return /*i18n*/ {
                id: "KHtcGn",
                message: "The calendar provider rejected the event creation request."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let CalendarEventCreationException = class CalendarEventCreationException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getCalendarEventCreationExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=calendar-event-creation.exception.js.map