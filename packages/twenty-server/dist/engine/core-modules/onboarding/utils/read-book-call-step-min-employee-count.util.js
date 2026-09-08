"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "readBookCallStepMinEmployeeCount", {
    enumerable: true,
    get: function() {
        return readBookCallStepMinEmployeeCount;
    }
});
const _getbookcallstepminemployeecountutil = require("./get-book-call-step-min-employee-count.util");
const readBookCallStepMinEmployeeCount = (twentyConfigService)=>(0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
        calendarBookingPageId: twentyConfigService.get('CALENDAR_BOOKING_PAGE_ID'),
        minEmployeeCount: twentyConfigService.get('ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT')
    });

//# sourceMappingURL=read-book-call-step-min-employee-count.util.js.map