// First-party apps whose logic-function executions do not consume the
// workspace's credits by default. These apps react to per-record events during
// mailbox/calendar import (Call Recorder, Last contact), which would otherwise
// drain the free-tier allowance. Operators can override this per app from the
// Admin Panel; the default is only applied when the registration is first
// created from the catalog.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MARKETPLACE_BILLING_EXEMPT_UNIVERSAL_IDENTIFIERS", {
    enumerable: true,
    get: function() {
        return MARKETPLACE_BILLING_EXEMPT_UNIVERSAL_IDENTIFIERS;
    }
});
const MARKETPLACE_BILLING_EXEMPT_UNIVERSAL_IDENTIFIERS = [
    '8da4b8b5-5edf-4880-b51f-ab6e679ec617',
    '66a504cc-0a75-410e-a43f-cdeae1db1522'
];

//# sourceMappingURL=marketplace-billing-exempt-applications.constant.js.map