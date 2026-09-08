/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveBillingPeriodBoundaryUpdate", {
    enumerable: true,
    get: function() {
        return resolveBillingPeriodBoundaryUpdate;
    }
});
const _utils = require("twenty-shared/utils");
const resolveBillingPeriodBoundaryUpdate = ({ incomingPeriodStart, storedSubscription })=>{
    if (!(0, _utils.isDefined)(storedSubscription) || !(0, _utils.isDefined)(incomingPeriodStart)) {
        return {};
    }
    const { currentPeriodStart, currentPeriodEnd } = storedSubscription;
    if (incomingPeriodStart.getTime() > currentPeriodStart.getTime()) {
        return {
            previousPeriodStart: currentPeriodStart
        };
    }
    // Stripe never moves a period backwards, so an older window is an event
    // delivered late. Letting it land would rewind the boundary the rollover
    // settles against and leave it behind the one already recorded.
    if (incomingPeriodStart.getTime() < currentPeriodStart.getTime()) {
        return {
            currentPeriodStart,
            currentPeriodEnd
        };
    }
    return {};
};

//# sourceMappingURL=resolve-billing-period-boundary-update.util.js.map