"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getOnboardingEnrichmentCreditRewardMicro", {
    enumerable: true,
    get: function() {
        return getOnboardingEnrichmentCreditRewardMicro;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
// Tiers are hand-authored config, so a malformed entry must drop out rather
// than coerce into a threshold of zero and pay every matched workspace.
const isUsableTier = (tier)=>(0, _guards.isNumber)(tier?.minEmployeeCount) && tier.minEmployeeCount >= 0 && (0, _guards.isNumber)(tier?.amountMicro) && tier.amountMicro > 0;
const getOnboardingEnrichmentCreditRewardMicro = ({ employeeCount, tiers })=>{
    if (!(0, _utils.isDefined)(tiers)) {
        return {
            amountMicro: null,
            malformedTierKeys: []
        };
    }
    const entries = Object.entries(tiers);
    // Reported whatever the employee count, so a mistyped tier surfaces on the
    // first enrichment after the config change rather than waiting for a
    // workspace that would have matched it.
    const malformedTierKeys = entries.filter(([, tier])=>!isUsableTier(tier)).map(([key])=>key);
    if (!(0, _guards.isNumber)(employeeCount)) {
        return {
            amountMicro: null,
            malformedTierKeys
        };
    }
    // Tiers are keyed for legibility, not ordered, so every one is measured and
    // the most generous match is the one owed.
    const matchedAmounts = entries.filter(([, tier])=>isUsableTier(tier) && employeeCount >= tier.minEmployeeCount).map(([, tier])=>tier.amountMicro);
    return {
        amountMicro: matchedAmounts.length > 0 ? Math.max(...matchedAmounts) : null,
        malformedTierKeys
    };
};

//# sourceMappingURL=get-onboarding-enrichment-credit-reward-micro.util.js.map