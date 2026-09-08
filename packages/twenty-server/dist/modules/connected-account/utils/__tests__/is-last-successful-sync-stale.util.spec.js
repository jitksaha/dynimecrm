"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _islastsuccessfulsyncstaleutil = require("../is-last-successful-sync-stale.util");
const _webhooksyncstalenessthresholdmsconstant = require("../../webhook-subscription-manager/constants/webhook-sync-staleness-threshold-ms.constant");
jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
describe('isLastSuccessfulSyncStale', ()=>{
    it('should return true when the last sync is older than the staleness threshold', ()=>{
        const syncedAt = new Date(Date.now() - _webhooksyncstalenessthresholdmsconstant.WEBHOOK_SYNC_STALENESS_THRESHOLD_MS - 1).toISOString();
        expect((0, _islastsuccessfulsyncstaleutil.isLastSuccessfulSyncStale)(syncedAt)).toBe(true);
    });
    it('should return false when the last sync is within the staleness threshold', ()=>{
        const syncedAt = new Date(Date.now() - _webhooksyncstalenessthresholdmsconstant.WEBHOOK_SYNC_STALENESS_THRESHOLD_MS + 1).toISOString();
        expect((0, _islastsuccessfulsyncstaleutil.isLastSuccessfulSyncStale)(syncedAt)).toBe(false);
    });
    it('should return true when the channel has never been synced', ()=>{
        expect((0, _islastsuccessfulsyncstaleutil.isLastSuccessfulSyncStale)(null)).toBe(true);
        expect((0, _islastsuccessfulsyncstaleutil.isLastSuccessfulSyncStale)(undefined)).toBe(true);
    });
    it('should throw an error when the timestamp is invalid', ()=>{
        expect(()=>{
            (0, _islastsuccessfulsyncstaleutil.isLastSuccessfulSyncStale)('invalid-date');
        }).toThrow('Invalid date format');
    });
});

//# sourceMappingURL=is-last-successful-sync-stale.util.spec.js.map