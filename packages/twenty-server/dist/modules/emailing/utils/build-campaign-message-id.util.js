"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCampaignMessageId", {
    enumerable: true,
    get: function() {
        return buildCampaignMessageId;
    }
});
const _uuid = require("uuid");
const _campaignconstant = require("../../../engine/core-modules/emailing-domain/constants/campaign.constant");
const buildCampaignMessageId = ({ campaignId, personId })=>(0, _uuid.v5)(`${campaignId}:${personId}`, _campaignconstant.CAMPAIGN_MESSAGE_ID_NAMESPACE);

//# sourceMappingURL=build-campaign-message-id.util.js.map