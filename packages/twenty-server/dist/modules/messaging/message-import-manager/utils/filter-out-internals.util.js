"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "filterOutInternals", {
    enumerable: true,
    get: function() {
        return filterOutInternals;
    }
});
const _utils = require("twenty-shared/utils");
const _getdomainfromemailorthrow = require("../../../../utils/get-domain-from-email-or-throw");
const filterOutInternals = (primaryHandle, messages)=>{
    return messages.filter((message)=>{
        if (!message.participants) {
            return true;
        }
        const primaryHandleDomain = (0, _getdomainfromemailorthrow.getDomainFromEmailOrThrow)(primaryHandle);
        try {
            const isAllHandlesFromSameDomain = message.participants.filter((participant)=>(0, _utils.isDefined)(participant.handle)).every((participant)=>(0, _utils.isDefined)(participant.handle) && (0, _getdomainfromemailorthrow.getDomainFromEmailOrThrow)(participant.handle) === primaryHandleDomain);
            if (isAllHandlesFromSameDomain) {
                return false;
            }
        } catch  {
            return true;
        }
        return true;
    });
};

//# sourceMappingURL=filter-out-internals.util.js.map