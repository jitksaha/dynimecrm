"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCampaignCounts", {
    enumerable: true,
    get: function() {
        return computeCampaignCounts;
    }
});
const _campaigndeliverystateconstant = require("../constants/campaign-delivery-state.constant");
const EMPTY_CAMPAIGN_COUNTS = {
    totalCount: 0,
    inProgressCount: 0,
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    skippedCount: 0,
    bouncedCount: 0,
    complainedCount: 0
};
const countFailedInGroup = (group)=>group.state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.FAILED ? Number(group.total) : Number(group.providerFailedCount);
const computeCampaignCounts = ({ groups })=>groups.reduce((counts, group)=>{
        const total = Number(group.total);
        const isInProgress = group.state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.QUEUED || group.state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENDING;
        return {
            totalCount: counts.totalCount + total,
            inProgressCount: counts.inProgressCount + (isInProgress ? total : 0),
            sentCount: counts.sentCount + (group.state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SENT ? total : 0),
            skippedCount: counts.skippedCount + (group.state === _campaigndeliverystateconstant.CAMPAIGN_DELIVERY_STATE.SKIPPED ? total : 0),
            failedCount: counts.failedCount + countFailedInGroup(group),
            deliveredCount: counts.deliveredCount + Number(group.deliveredCount),
            bouncedCount: counts.bouncedCount + Number(group.bouncedCount),
            complainedCount: counts.complainedCount + Number(group.complainedCount)
        };
    }, EMPTY_CAMPAIGN_COUNTS);

//# sourceMappingURL=compute-campaign-counts.util.js.map