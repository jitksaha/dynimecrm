"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeCampaignRecipients", {
    enumerable: true,
    get: function() {
        return normalizeCampaignRecipients;
    }
});
const _guards = require("@sniptt/guards");
const normalizeCampaignRecipients = (rawRecipients)=>{
    const skipped = {
        noEmail: 0,
        deduped: 0
    };
    const seenEmails = new Set();
    const recipients = [];
    for (const candidate of rawRecipients){
        const normalizedEmail = candidate.email?.trim().toLowerCase();
        if (!(0, _guards.isNonEmptyString)(normalizedEmail)) {
            skipped.noEmail += 1;
            continue;
        }
        if (seenEmails.has(normalizedEmail)) {
            skipped.deduped += 1;
            continue;
        }
        seenEmails.add(normalizedEmail);
        recipients.push({
            email: normalizedEmail,
            personId: candidate.personId
        });
    }
    return {
        recipients,
        skipped
    };
};

//# sourceMappingURL=normalize-campaign-recipients.util.js.map