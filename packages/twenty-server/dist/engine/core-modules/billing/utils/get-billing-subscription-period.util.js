/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getBillingSubscriptionPeriod", {
    enumerable: true,
    get: function() {
        return getBillingSubscriptionPeriod;
    }
});
const _utils = require("twenty-shared/utils");
const _billingsubscriptionstatusenum = require("../enums/billing-subscription-status.enum");
const getBillingSubscriptionPeriod = (subscription)=>{
    const { trialStart, trialEnd } = subscription;
    if (subscription.status === _billingsubscriptionstatusenum.SubscriptionStatus.Trialing && (0, _utils.isDefined)(trialStart) && (0, _utils.isDefined)(trialEnd)) {
        return {
            periodStart: trialStart,
            periodEnd: trialEnd
        };
    }
    return {
        periodStart: subscription.currentPeriodStart,
        periodEnd: subscription.currentPeriodEnd
    };
};

//# sourceMappingURL=get-billing-subscription-period.util.js.map