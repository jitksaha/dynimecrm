"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _campaigndeliverystateconstant = require("../../constants/campaign-delivery-state.constant");
const _computecampaigncountsutil = require("../compute-campaign-counts.util");
const buildGroup = (overrides)=>({
        state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENT,
        total: '0',
        deliveredCount: '0',
        bouncedCount: '0',
        complainedCount: '0',
        providerFailedCount: '0',
        ...overrides
    });
describe('computeCampaignCounts', ()=>{
    it('keeps counting a delivered message as sent', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    total: '1',
                    deliveredCount: '1'
                })
            ]
        });
        expect(counts.sentCount).toBe(1);
        expect(counts.deliveredCount).toBe(1);
    });
    it('counts a complaint against a delivered message without losing either', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    total: '1',
                    deliveredCount: '1',
                    complainedCount: '1'
                })
            ]
        });
        expect(counts.sentCount).toBe(1);
        expect(counts.deliveredCount).toBe(1);
        expect(counts.complainedCount).toBe(1);
    });
    it('does not count a message we never sent', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED,
                    total: '1'
                }),
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                    total: '1'
                })
            ]
        });
        expect(counts.sentCount).toBe(0);
        expect(counts.skippedCount).toBe(1);
        expect(counts.failedCount).toBe(1);
    });
    it('counts a bounce for a message that was sent', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    total: '1',
                    bouncedCount: '1'
                })
            ]
        });
        expect(counts.sentCount).toBe(1);
        expect(counts.bouncedCount).toBe(1);
        expect(counts.deliveredCount).toBe(0);
    });
    it('treats everything still queued or sending as in progress', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED,
                    total: '7'
                }),
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENDING,
                    total: '3'
                })
            ]
        });
        expect(counts.inProgressCount).toBe(10);
        expect(counts.totalCount).toBe(10);
    });
    it('adds every group up into one total', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENT,
                    total: '600'
                }),
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED,
                    total: '3'
                }),
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                    total: '2'
                })
            ]
        });
        expect(counts.totalCount).toBe(605);
        expect(counts.sentCount).toBe(600);
    });
    it('counts a rejected send as failed while still counting it as sent', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    total: '10',
                    providerFailedCount: '2'
                })
            ]
        });
        expect(counts.sentCount).toBe(10);
        expect(counts.failedCount).toBe(2);
    });
    it('counts a failed row once even when the provider also refused it', ()=>{
        const counts = (0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: [
                buildGroup({
                    state: _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED,
                    total: '3',
                    providerFailedCount: '3'
                })
            ]
        });
        expect(counts.failedCount).toBe(3);
    });
    it('reads an empty campaign as all zeroes', ()=>{
        expect((0, _computecampaigncountsutil.computeCampaignCounts)({
            groups: []
        })).toEqual({
            totalCount: 0,
            inProgressCount: 0,
            sentCount: 0,
            deliveredCount: 0,
            failedCount: 0,
            skippedCount: 0,
            bouncedCount: 0,
            complainedCount: 0
        });
    });
});

//# sourceMappingURL=compute-campaign-counts.util.spec.js.map