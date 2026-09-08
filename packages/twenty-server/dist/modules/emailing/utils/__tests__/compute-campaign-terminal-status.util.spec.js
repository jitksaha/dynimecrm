"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _computecampaignterminalstatusutil = require("../compute-campaign-terminal-status.util");
describe('computeCampaignTerminalStatus', ()=>{
    it.each([
        {
            failedCount: 0,
            skippedCount: 0
        },
        {
            failedCount: 1,
            skippedCount: 0
        },
        {
            failedCount: 0,
            skippedCount: 1
        },
        {
            failedCount: 1,
            skippedCount: 1
        }
    ])('should return undefined while a message is still queued (failed: $failedCount, skipped: $skippedCount)', ({ failedCount, skippedCount })=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 1,
            failedCount,
            skippedCount
        })).toBeUndefined();
    });
    it('should return SENT when every message succeeded', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 0,
            failedCount: 0,
            skippedCount: 0
        })).toBe(_types.MessageCampaignStatus.SENT);
    });
    it('should return SENT_WITH_ERRORS when a message failed', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 0,
            failedCount: 3,
            skippedCount: 0
        })).toBe(_types.MessageCampaignStatus.SENT_WITH_ERRORS);
    });
    it('should return SENT_WITH_ERRORS when a message was skipped', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 0,
            failedCount: 0,
            skippedCount: 3
        })).toBe(_types.MessageCampaignStatus.SENT_WITH_ERRORS);
    });
    it('should return SENT_WITH_ERRORS when messages both failed and were skipped', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 0,
            failedCount: 2,
            skippedCount: 5
        })).toBe(_types.MessageCampaignStatus.SENT_WITH_ERRORS);
    });
    it('should return SENT when every message finished cleanly', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 0,
            failedCount: 0,
            skippedCount: 0
        })).toBe(_types.MessageCampaignStatus.SENT);
    });
    it('should not report a clean send when every recipient was filtered out before materialization', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 0,
            inProgressCount: 0,
            failedCount: 0,
            skippedCount: 0
        })).toBe(_types.MessageCampaignStatus.SENT_WITH_ERRORS);
    });
    it('should stay unfinished while a message is claimed but not yet resolved', ()=>{
        expect((0, _computecampaignterminalstatusutil.computeCampaignTerminalStatus)({
            totalCount: 10,
            inProgressCount: 1,
            failedCount: 0,
            skippedCount: 0
        })).toBeUndefined();
    });
});

//# sourceMappingURL=compute-campaign-terminal-status.util.spec.js.map