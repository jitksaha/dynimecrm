"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ACQUIRE_ONBOARDING_STEP_TRANSITION_LOCK_STATEMENT", {
    enumerable: true,
    get: function() {
        return ACQUIRE_ONBOARDING_STEP_TRANSITION_LOCK_STATEMENT;
    }
});
const ACQUIRE_ONBOARDING_STEP_TRANSITION_LOCK_STATEMENT = 'SELECT pg_advisory_xact_lock(hashtextextended($1, 0))';

//# sourceMappingURL=acquire-onboarding-step-transition-lock-statement.js.map