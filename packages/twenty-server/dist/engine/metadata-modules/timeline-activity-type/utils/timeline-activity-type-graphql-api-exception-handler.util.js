"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "timelineActivityTypeGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return timelineActivityTypeGraphqlApiExceptionHandler;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _timelineactivitytypeexceptioncodeenum = require("../enums/timeline-activity-type-exception-code.enum");
const _timelineactivitytypeexception = require("../timeline-activity-type.exception");
const timelineActivityTypeGraphqlApiExceptionHandler = (error)=>{
    if (error instanceof _timelineactivitytypeexception.TimelineActivityTypeException) {
        switch(error.code){
            case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NOT_FOUND:
                throw new _graphqlerrorsutil.NotFoundError(error);
            case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_CANNOT_BE_RESET:
            case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NAME_ALREADY_EXISTS:
            case _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.INVALID_TIMELINE_ACTIVITY_TYPE_INPUT:
                throw new _graphqlerrorsutil.UserInputError(error);
            default:
                return (0, _utils.assertUnreachable)(error.code);
        }
    }
    throw error;
};

//# sourceMappingURL=timeline-activity-type-graphql-api-exception-handler.util.js.map