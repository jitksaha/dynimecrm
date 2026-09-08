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
    get TimelineException () {
        return TimelineException;
    },
    get TimelineExceptionCode () {
        return TimelineExceptionCode;
    }
});
const _standarderrormessageconstant = require("../../../engine/api/common/common-query-runners/errors/standard-error-message.constant");
const _customexception = require("../../../utils/custom-exception");
var TimelineExceptionCode = /*#__PURE__*/ function(TimelineExceptionCode) {
    TimelineExceptionCode["TIMELINE_ACTIVITY_TYPE_RESOLUTION_FAILED"] = "TIMELINE_ACTIVITY_TYPE_RESOLUTION_FAILED";
    return TimelineExceptionCode;
}({});
let TimelineException = class TimelineException extends _customexception.CustomException {
    constructor(message){
        super(message, "TIMELINE_ACTIVITY_TYPE_RESOLUTION_FAILED", {
            userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
        });
    }
};

//# sourceMappingURL=timeline.exception.js.map