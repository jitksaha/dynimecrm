"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getBookCallStepMinEmployeeCount", {
    enumerable: true,
    get: function() {
        return getBookCallStepMinEmployeeCount;
    }
});
const _guards = require("@sniptt/guards");
const getBookCallStepMinEmployeeCount = ({ calendarBookingPageId, minEmployeeCount })=>{
    if (!(0, _guards.isNonEmptyString)(calendarBookingPageId) || !(0, _guards.isNumber)(minEmployeeCount) || minEmployeeCount <= 0) {
        return null;
    }
    return minEmployeeCount;
};

//# sourceMappingURL=get-book-call-step-min-employee-count.util.js.map