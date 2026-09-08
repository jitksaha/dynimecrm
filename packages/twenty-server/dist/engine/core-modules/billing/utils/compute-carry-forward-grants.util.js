/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCarryForwardGrants", {
    enumerable: true,
    get: function() {
        return computeCarryForwardGrants;
    }
});
const _billingcreditgranttypeenum = require("../enums/billing-credit-grant-type.enum");
const isCappedType = (type)=>_billingcreditgranttypeenum.CAPPED_BILLING_CREDIT_GRANT_TYPES.includes(type);
// Capped credits are spent first so that deliberately granted credits
// (compensation, partnership, onboarding rewards) survive the period and carry
// over at their full value instead of being clipped by the rollover cap.
const compareSpendingOrder = (a, b)=>{
    const [isACapped, isBCapped] = [
        isCappedType(a.type),
        isCappedType(b.type)
    ];
    if (isACapped !== isBCapped) {
        return isACapped ? -1 : 1;
    }
    const byCreatedAt = a.createdAt.getTime() - b.createdAt.getTime();
    if (byCreatedAt !== 0) {
        return byCreatedAt;
    }
    // Grants written in the same transaction share a timestamp, and the order
    // decides which grant id ends up on which carry-forward row. That id is part
    // of the replay key, so without a stable tie-break a redelivery could write
    // a second set of rows for the same credits.
    return (a.grantId ?? '').localeCompare(b.grantId ?? '');
};
const computeCarryForwardGrants = ({ allowanceMicro, liveGrants, usageMicro, rolloverCapMicro })=>{
    const allowanceBucket = {
        grantId: null,
        type: _billingcreditgranttypeenum.BillingCreditGrantType.ROLLOVER,
        amountMicro: Math.max(0, allowanceMicro),
        createdAt: new Date(0)
    };
    const buckets = [
        allowanceBucket,
        ...liveGrants.filter((grant)=>grant.amountMicro > 0)
    ].sort(compareSpendingOrder);
    let remainingUsageMicro = Math.max(0, usageMicro);
    const unspentBuckets = buckets.map((bucket)=>{
        const consumedMicro = Math.min(bucket.amountMicro, remainingUsageMicro);
        remainingUsageMicro -= consumedMicro;
        return {
            ...bucket,
            amountMicro: bucket.amountMicro - consumedMicro
        };
    });
    const cappedUnspentMicro = unspentBuckets.filter((bucket)=>isCappedType(bucket.type)).reduce((total, bucket)=>total + bucket.amountMicro, 0);
    const rolloverMicro = Math.floor(Math.min(cappedUnspentMicro, Math.max(0, rolloverCapMicro)));
    const rolloverGrants = rolloverMicro > 0 ? [
        {
            type: _billingcreditgranttypeenum.BillingCreditGrantType.ROLLOVER,
            amountMicro: rolloverMicro,
            sourceGrantId: null
        }
    ] : [];
    const preservedGrants = unspentBuckets.filter((bucket)=>!isCappedType(bucket.type) && bucket.amountMicro >= 1).map((bucket)=>({
            type: bucket.type,
            amountMicro: Math.floor(bucket.amountMicro),
            sourceGrantId: bucket.grantId
        }));
    return [
        ...rolloverGrants,
        ...preservedGrants
    ];
};

//# sourceMappingURL=compute-carry-forward-grants.util.js.map