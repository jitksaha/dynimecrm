"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _applymanuallyassigneddefaultutil = require("../apply-manually-assigned-default.util");
describe('applyManuallyAssignedDefault', ()=>{
    it('defaults an attachment without provenance to manually assigned', ()=>{
        expect((0, _applymanuallyassigneddefaultutil.applyManuallyAssignedDefault)({
            messageThreadId: 'thread-id',
            targetPersonId: 'person-id'
        })).toEqual({
            messageThreadId: 'thread-id',
            targetPersonId: 'person-id',
            isManuallyAssigned: true
        });
    });
    it('preserves an explicit caller-provided provenance', ()=>{
        expect((0, _applymanuallyassigneddefaultutil.applyManuallyAssignedDefault)({
            calendarEventId: 'event-id',
            targetCompanyId: 'company-id',
            isManuallyAssigned: false
        })).toEqual({
            calendarEventId: 'event-id',
            targetCompanyId: 'company-id',
            isManuallyAssigned: false
        });
    });
});

//# sourceMappingURL=apply-manually-assigned-default.util.spec.js.map