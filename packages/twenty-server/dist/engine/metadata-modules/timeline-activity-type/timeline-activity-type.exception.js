"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTypeException", {
    enumerable: true,
    get: function() {
        return TimelineActivityTypeException;
    }
});
const _utils = require("twenty-shared/utils");
const _timelineactivitytypeexceptioncodeenum = require("./enums/timeline-activity-type-exception-code.enum");
const _customexception = require("../../../utils/custom-exception");
const getTimelineActivityTypeExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NOT_FOUND:
            return /*i18n*/ {
                id: "1+EKCZ",
                message: "Timeline activity type not found."
            };
        case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_CANNOT_BE_RESET:
            return /*i18n*/ {
                id: "7VVv8j",
                message: "Custom timeline activity type cannot be reset to default."
            };
        case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NAME_ALREADY_EXISTS:
            return /*i18n*/ {
                id: "jxz4n1",
                message: "Timeline activity type name already exists."
            };
        case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT:
            return /*i18n*/ {
                id: "G26J1R",
                message: "Invalid timeline activity type input."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let TimelineActivityTypeException = class TimelineActivityTypeException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getTimelineActivityTypeExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=timeline-activity-type.exception.js.map