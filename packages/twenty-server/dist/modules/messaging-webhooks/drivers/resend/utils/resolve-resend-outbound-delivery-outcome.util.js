"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveResendOutboundDeliveryOutcome", {
    enumerable: true,
    get: function() {
        return resolveResendOutboundDeliveryOutcome;
    }
});
const _utils = require("twenty-shared/utils");
const _campaignprovideroutcomeconstant = require("../../../../../engine/core-modules/emailing-domain/constants/campaign-provider-outcome.constant");
const _messagesuppressionreasontype = require("../../../../../engine/core-modules/emailing-domain/types/message-suppression-reason.type");
const resolveResendOutboundDeliveryOutcome = (event)=>{
    const providerEventId = event.data?.email_id ?? null;
    const envelopeRecipients = [
        ...event.data?.to ?? [],
        ...event.data?.cc ?? [],
        ...event.data?.bcc ?? []
    ];
    const emailAddresses = envelopeRecipients.length === 1 ? envelopeRecipients : [];
    if (event.type === 'email.delivered') {
        return {
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.DELIVERED,
            suppression: null,
            providerEventId
        };
    }
    if (event.type === 'email.failed') {
        return {
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.REJECTED,
            suppression: null,
            providerEventId
        };
    }
    if (event.type === 'email.bounced') {
        if (event.data?.bounce?.type !== 'Permanent') {
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
    if (event.type === 'email.complained') {
        return {
            outcome: _campaignprovideroutcomeconstant.CAMPAIGN_PROVIDER_OUTCOME.COMPLAINED,
            suppression: (0, _utils.isNonEmptyArray)(emailAddresses) ? {
                reason: _messagesuppressionreasontype.MessageSuppressionReason.COMPLAINT,
                emailAddresses
            } : null,
            providerEventId
        };
    }
    return null;
};

//# sourceMappingURL=resolve-resend-outbound-delivery-outcome.util.js.map