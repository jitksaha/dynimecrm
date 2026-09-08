"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildOnboardingStepTransitionLockName", {
    enumerable: true,
    get: function() {
        return buildOnboardingStepTransitionLockName;
    }
});
const _onboardingsteptransitionlockprefix = require("../constants/onboarding-step-transition-lock-prefix");
const buildOnboardingStepTransitionLockName = ({ userId, workspaceId })=>`${_onboardingsteptransitionlockprefix.ONBOARDING_STEP_TRANSITION_LOCK_PREFIX}:${userId}:${workspaceId}`;

//# sourceMappingURL=build-onboarding-step-transition-lock-name.util.js.map