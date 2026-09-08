"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _campaignprovideroutcomeconstant = require("../../constants/campaign-provider-outcome.constant");
const _buildcampaigndeliveryoutcomeupdateutil = require("../build-campaign-delivery-outcome-update.util");
const occurredAt = new Date('2026-01-01T00:00:00Z');
describe('buildCampaignDeliveryOutcomeUpdate', ()=>{
    it.each([
        [
            _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.DELIVERED,
            'deliveredAt'
        ],
        [
            _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.BOUNCED,
            'bouncedAt'
        ],
        [
            _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.COMPLAINED,
            'complainedAt'
        ],
        [
            _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.REJECTED,
            'rejectedAt'
        ],
        [
            _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.RENDERING_FAILED,
            'renderingFailedAt'
        ]
    ])('stamps %s on its own column', (outcome, column)=>{
        expect((0, _buildcampaigndeliveryoutcomeupdateutil.buildCampaignDeliveryOutcomeUpdate)({
            outcome,
            occurredAt
        })).toEqual({
            [column]: occurredAt
        });
    });
    it('leaves the row alone for a soft bounce, which the provider will retry itself', ()=>{
        expect((0, _buildcampaigndeliveryoutcomeupdateutil.buildCampaignDeliveryOutcomeUpdate)({
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.SOFT_BOUNCED,
            occurredAt
        })).toEqual({});
    });
    it('never writes the state or reason the send pipeline owns', ()=>{
        const updates = Object.values(_campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME).map((outcome)=>(0, _buildcampaigndeliveryoutcomeupdateutil.buildCampaignDeliveryOutcomeUpdate)({
                outcome,
                occurredAt
            }));
        for (const update of updates){
            expect(update).not.toHaveProperty('state');
            expect(update).not.toHaveProperty('skipReason');
            expect(update).not.toHaveProperty('failureReason');
        }
    });
});

//# sourceMappingURL=build-campaign-delivery-outcome-update.util.spec.js.map