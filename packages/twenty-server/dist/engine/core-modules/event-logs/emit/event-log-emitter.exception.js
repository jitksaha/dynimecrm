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
    get EventLogEmitterException () {
        return EventLogEmitterException;
    },
    get EventLogEmitterExceptionCode () {
        return EventLogEmitterExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var EventLogEmitterExceptionCode = /*#__PURE__*/ function(EventLogEmitterExceptionCode) {
    EventLogEmitterExceptionCode["INVALID_TYPE"] = "INVALID_TYPE";
    EventLogEmitterExceptionCode["INVALID_INPUT"] = "INVALID_INPUT";
    return EventLogEmitterExceptionCode;
}({});
const getEventLogEmitterExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "INVALID_TYPE":
            return /*i18n*/ {
                id: "4LIgRz",
                message: "Invalid event type."
            };
        case "INVALID_INPUT":
            return /*i18n*/ {
                id: "8knMLv",
                message: "Invalid event input."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let EventLogEmitterException = class EventLogEmitterException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getEventLogEmitterExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=event-log-emitter.exception.js.map