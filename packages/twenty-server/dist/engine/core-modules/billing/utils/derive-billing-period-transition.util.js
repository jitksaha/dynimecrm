/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deriveBillingPeriodTransition", {
    enumerable: true,
    get: function() {
        return deriveBillingPeriodTransition;
    }
});
const _datefns = require("date-fns");
const _utils = require("twenty-shared/utils");
const _billingsubscriptionintervalenum = require("../enums/billing-subscription-interval.enum");
const deriveBillingPeriodTransition = ({ invoicePeriodStart, invoicePeriodEnd, subscriptionCurrentPeriodStart, subscriptionCurrentPeriodEnd, subscriptionInterval, trialStart, isFirstPeriodAfterTrial, subscriptionPreviousPeriodStart, ledgerPeriodStart })=>{
    const boundary = invoicePeriodStart;
    const nextPeriodEnd = invoicePeriodEnd.getTime() > boundary.getTime() ? invoicePeriodEnd : subscriptionCurrentPeriodEnd;
    const closingPeriodStart = (()=>{
        if (isFirstPeriodAfterTrial && (0, _utils.isDefined)(trialStart)) {
            return trialStart;
        }
        if (subscriptionCurrentPeriodStart.getTime() < boundary.getTime()) {
            return subscriptionCurrentPeriodStart;
        }
        // Recorded when the subscription advanced, so it is exact whatever the
        // anchor. Calendar arithmetic cannot reproduce it for month-end anchors: a
        // period running January 31 to February 28 comes back as starting January
        // 28, which widens the usage window into the period before and drags
        // already expired grants back into the carry-forward.
        if ((0, _utils.isDefined)(subscriptionPreviousPeriodStart) && subscriptionPreviousPeriodStart.getTime() < boundary.getTime()) {
            return subscriptionPreviousPeriodStart;
        }
        // Only until each subscription has transitioned once with the column in
        // place. The ledger records the boundary whenever the previous transition
        // closed a grant there, which is most workspaces but not all.
        if ((0, _utils.isDefined)(ledgerPeriodStart) && ledgerPeriodStart.getTime() < boundary.getTime()) {
            return ledgerPeriodStart;
        }
        // Calendar arithmetic, not the invoiced duration: consecutive periods
        // differ in length, so a February renewal bills 28 days and subtracting
        // those from February 1 would place the closing period at January 4 and
        // drop three days of usage, which then reads as unspent allowance.
        return subscriptionInterval === _billingsubscriptionintervalenum.SubscriptionInterval.Year ? (0, _datefns.subYears)(boundary, 1) : (0, _datefns.subMonths)(boundary, 1);
    })();
    return {
        closingPeriodStart,
        closingPeriodEnd: boundary,
        nextPeriodStart: boundary,
        nextPeriodEnd
    };
};

//# sourceMappingURL=derive-billing-period-transition.util.js.map