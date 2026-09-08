"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCampaignDeliveryOutcomeUpdate", {
    enumerable: true,
    get: function() {
        return buildCampaignDeliveryOutcomeUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const _campaignprovideroutcomeconstant = require("../constants/campaign-provider-outcome.constant");
const buildCampaignDeliveryOutcomeUpdate = ({ outcome, occurredAt })=>{
    switch(outcome){
        case _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.DELIVERED:
            return {
                deliveredAt: occurredAt
            };
        case _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.BOUNCED:
            return {
                bouncedAt: occurredAt
            };
        case _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.COMPLAINED:
            return {
                complainedAt: occurredAt
            };
        case _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.REJECTED:
            return {
                rejectedAt: occurredAt
            };
        case _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.RENDERING_FAILED:
            return {
                renderingFailedAt: occurredAt
            };
        case _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.SOFT_BOUNCED:
            return {};
        default:
            return (0, _utils.assertUnreachable)(outcome);
    }
};

//# sourceMappingURL=build-campaign-delivery-outcome-update.util.js.map