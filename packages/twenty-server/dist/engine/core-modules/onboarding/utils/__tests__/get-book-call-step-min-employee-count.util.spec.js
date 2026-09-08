"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getbookcallstepminemployeecountutil = require("../get-book-call-step-min-employee-count.util");
describe('getBookCallStepMinEmployeeCount', ()=>{
    const calendarBookingPageId = 'team/twenty/talk-to-us';
    it('should return the threshold when both settings are configured', ()=>{
        expect((0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
            calendarBookingPageId,
            minEmployeeCount: 50
        })).toBe(50);
    });
    it('should treat a zero threshold as disabled', ()=>{
        expect((0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
            calendarBookingPageId,
            minEmployeeCount: 0
        })).toBeNull();
    });
    it('should treat a negative threshold as disabled', ()=>{
        expect((0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
            calendarBookingPageId,
            minEmployeeCount: -1
        })).toBeNull();
    });
    it('should accept the smallest enabling threshold', ()=>{
        expect((0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
            calendarBookingPageId,
            minEmployeeCount: 1
        })).toBe(1);
    });
    it('should be disabled without a threshold', ()=>{
        expect((0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
            calendarBookingPageId,
            minEmployeeCount: undefined
        })).toBeNull();
    });
    it.each([
        undefined,
        ''
    ])('should be disabled when the booking page id is %p', (bookingPageId)=>{
        expect((0, _getbookcallstepminemployeecountutil.getBookCallStepMinEmployeeCount)({
            calendarBookingPageId: bookingPageId,
            minEmployeeCount: 50
        })).toBeNull();
    });
});

//# sourceMappingURL=get-book-call-step-min-employee-count.util.spec.js.map