"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromUsageLimitEntityToFlat", {
    enumerable: true,
    get: function() {
        return fromUsageLimitEntityToFlat;
    }
});
const fromUsageLimitEntityToFlat = (usageLimit)=>({
        id: usageLimit.id,
        resourceType: usageLimit.resourceType,
        operationType: usageLimit.operationType,
        spenderType: usageLimit.spenderType,
        spenderId: usageLimit.spenderId,
        limitKind: usageLimit.limitKind,
        windowSeconds: usageLimit.windowSeconds,
        limitValueType: usageLimit.limitValueType,
        limitValue: usageLimit.limitValue,
        burstValue: usageLimit.burstValue
    });

//# sourceMappingURL=from-usage-limit-entity-to-flat.util.js.map