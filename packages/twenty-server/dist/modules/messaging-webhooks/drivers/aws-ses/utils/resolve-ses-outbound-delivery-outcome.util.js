"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveSesOutboundDeliveryOutcome", {
    enumerable: true,
    get: function() {
        return resolveSesOutboundDeliveryOutcome;
    }
});
const _utils = require("twenty-shared/utils");
const _campaignprovideroutcomeconstant = require("../../../../../engine/core-modules/emailing-domain/constants/campaign-provider-outcome.constant");
const _messagesuppressionreasontype = require("../../../../../engine/core-modules/emailing-domain/types/message-suppression-reason.type");
const extractRecipientAddresses = (recipients)=>(recipients ?? []).map((recipient)=>recipient.emailAddress);
const resolveSesOutboundDeliveryOutcome = ({ eventName, payload })=>{
    switch(eventName){
        case 'Email Delivered':
        case 'Delivery':
            return {
                outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.DELIVERED,
                suppression: null,
                providerEventId: null
            };
        case 'Email Rejected':
        case 'Reject':
            return {
                outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.REJECTED,
                suppression: null,
                providerEventId: null
            };
        case 'Email Rendering Failed':
        case 'Rendering Failure':
            return {
                outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.RENDERING_FAILED,
                suppression: null,
                providerEventId: null
            };
        case 'Email Bounced':
        case 'Bounce':
            {
                const bounce = payload.bounce;
                const emailAddresses = extractRecipientAddresses(bounce?.bouncedRecipients);
                const providerEventId = bounce?.feedbackId ?? null;
                if (bounce?.bounceType !== 'Permanent') {
                    return {
                        outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.SOFT_BOUNCED,
                        suppression: null,
                        providerEventId
                    };
                }
                return {
                    outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.BOUNCED,
                    suppression: (0, _utils.isNonEmptyArray)(emailAddresses) ? {
                        reason: _messagesuppressionreasontype.MessageSuppressionReason.BOUNCE,
                        emailAddresses
                    } : null,
                    providerEventId
                };
            }
        case 'Email Complaint Received':
        case 'Complaint':
            {
                const complaint = payload.complaint;
                const emailAddresses = extractRecipientAddresses(complaint?.complainedRecipients);
                return {
                    outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.COMPLAINED,
                    suppression: (0, _utils.isNonEmptyArray)(emailAddresses) ? {
                        reason: _messagesuppressionreasontype.MessageSuppressionReason.COMPLAINT,
                        emailAddresses
                    } : null,
                    providerEventId: complaint?.feedbackId ?? null
                };
            }
        default:
            return null;
    }
};

//# sourceMappingURL=resolve-ses-outbound-delivery-outcome.util.js.map