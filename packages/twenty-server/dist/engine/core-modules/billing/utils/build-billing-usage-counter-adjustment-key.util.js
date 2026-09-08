// Records that a one-off adjustment (a revocation, a period transition) already
// moved the counter, so a retry can tell "already applied" from "never got that
// far".
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildBillingUsageCounterAdjustmentKey", {
    enumerable: true,
    get: function() {
        return buildBillingUsageCounterAdjustmentKey;
    }
});
const buildBillingUsageCounterAdjustmentKey = (workspaceId, adjustmentKey)=>{
    return `available-credits-adjusted:${workspaceId}:${adjustmentKey}`;
};

//# sourceMappingURL=build-billing-usage-counter-adjustment-key.util.js.map