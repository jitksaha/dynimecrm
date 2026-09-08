/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NOT_ENDED_SUBSCRIPTION_STATUSES", {
    enumerable: true,
    get: function() {
        return NOT_ENDED_SUBSCRIPTION_STATUSES;
    }
});
const _billingsubscriptionstatusenum = require("../enums/billing-subscription-status.enum");
const NOT_ENDED_SUBSCRIPTION_STATUSES = [
    _billingsubscriptionstatusenum.SubscriptionStatus.Active,
    _billingsubscriptionstatusenum.SubscriptionStatus.Trialing,
    _billingsubscriptionstatusenum.SubscriptionStatus.PastDue,
    _billingsubscriptionstatusenum.SubscriptionStatus.Unpaid,
    _billingsubscriptionstatusenum.SubscriptionStatus.Incomplete,
    _billingsubscriptionstatusenum.SubscriptionStatus.Paused
];

//# sourceMappingURL=not-ended-subscription-statuses.constant.js.map