"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveCampaignAudience", {
    enumerable: true,
    get: function() {
        return resolveCampaignAudience;
    }
});
const _normalizecampaignrecipientsutil = require("./normalize-campaign-recipients.util");
const resolveCampaignAudience = ({ rawRecipients, totalMemberCount, maxRecipients, hardSuppressedEmails, globallySuppressedEmails, topicSuppressedEmails })=>{
    const { recipients, skipped } = (0, _normalizecampaignrecipientsutil.normalizeCampaignRecipients)(rawRecipients);
    const sendableRecipients = [];
    const excluded = {
        hardSuppressed: 0,
        globally: 0,
        byTopic: 0
    };
    let overCap = 0;
    for (const recipient of recipients){
        if (hardSuppressedEmails.has(recipient.email)) {
            excluded.hardSuppressed += 1;
            continue;
        }
        if (globallySuppressedEmails.has(recipient.email)) {
            excluded.globally += 1;
            continue;
        }
        if (topicSuppressedEmails.has(recipient.email)) {
            excluded.byTopic += 1;
            continue;
        }
        if (sendableRecipients.length >= maxRecipients) {
            overCap += 1;
            continue;
        }
        sendableRecipients.push(recipient);
    }
    return {
        sendableRecipients,
        audience: {
            totalMembers: totalMemberCount,
            withoutEmail: skipped.noEmail,
            duplicateEmails: skipped.deduped,
            overCap,
            hardSuppressed: excluded.hardSuppressed,
            globallyUnsubscribed: excluded.globally,
            topicUnsubscribed: excluded.byTopic,
            sendable: sendableRecipients.length
        }
    };
};

//# sourceMappingURL=resolve-campaign-audience.util.js.map