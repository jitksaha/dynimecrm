"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isBillingExemptApplication", {
    enumerable: true,
    get: function() {
        return isBillingExemptApplication;
    }
});
const _marketplacebillingexemptapplicationsconstant = require("../constants/marketplace-billing-exempt-applications.constant");
const isBillingExemptApplication = (universalIdentifier)=>_marketplacebillingexemptapplicationsconstant.MARKETPLACE_BILLING_EXEMPT_UNIVERSAL_IDENTIFIERS.includes(universalIdentifier);

//# sourceMappingURL=is-billing-exempt-application.util.js.map