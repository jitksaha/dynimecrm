"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getOnboardingInviteSuggestionsCacheKey", {
    enumerable: true,
    get: function() {
        return getOnboardingInviteSuggestionsCacheKey;
    }
});
const getOnboardingInviteSuggestionsCacheKey = (workspaceId, userId)=>`${workspaceId}:${userId}`;

//# sourceMappingURL=get-onboarding-invite-suggestions-cache-key.util.js.map