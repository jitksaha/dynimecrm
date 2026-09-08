/* @license Enterprise */ // Serializes everything that moves a workspace's credit state: writing to the
// ledger and adjusting the counter derived from it. Readers take it too, but
// only when the counter is cold, so the warm path stays lock-free.
//
// Without it the ledger write and the counter update are two independent
// steps, and a reader computing availability in between either counts a grant
// that the writer then adds again, or installs a balance that predates it.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildBillingCreditStateLockKey", {
    enumerable: true,
    get: function() {
        return buildBillingCreditStateLockKey;
    }
});
const buildBillingCreditStateLockKey = (workspaceId)=>`billing-credit-state:${workspaceId}`;

//# sourceMappingURL=build-billing-credit-state-lock-key.util.js.map