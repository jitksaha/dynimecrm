/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasCustomAiProviderAccess", {
    enumerable: true,
    get: function() {
        return hasCustomAiProviderAccess;
    }
});
const _maxseatswithoutenterprisekeyconstant = require("../constants/max-seats-without-enterprise-key.constant");
const hasCustomAiProviderAccess = ({ isBillingEnabled, hasValidEnterprisePlan, seatCount })=>isBillingEnabled || hasValidEnterprisePlan || seatCount <= _maxseatswithoutenterprisekeyconstant.MAX_SEATS_WITHOUT_ENTERPRISE_KEY;

//# sourceMappingURL=has-custom-ai-provider-access.util.js.map