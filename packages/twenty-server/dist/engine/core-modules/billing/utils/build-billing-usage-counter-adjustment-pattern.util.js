"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildBillingUsageCounterAdjustmentPattern", {
    enumerable: true,
    get: function() {
        return buildBillingUsageCounterAdjustmentPattern;
    }
});
const buildBillingUsageCounterAdjustmentPattern = (workspaceId)=>{
    return `available-credits-adjusted:${workspaceId}:*`;
};

//# sourceMappingURL=build-billing-usage-counter-adjustment-pattern.util.js.map