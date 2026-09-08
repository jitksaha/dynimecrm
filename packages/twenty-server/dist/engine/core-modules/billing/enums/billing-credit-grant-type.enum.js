/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ADMIN_GRANTABLE_CREDIT_GRANT_TYPES () {
        return ADMIN_GRANTABLE_CREDIT_GRANT_TYPES;
    },
    get BillingCreditGrantType () {
        return BillingCreditGrantType;
    },
    get CAPPED_BILLING_CREDIT_GRANT_TYPES () {
        return CAPPED_BILLING_CREDIT_GRANT_TYPES;
    }
});
const _graphql = require("@nestjs/graphql");
var BillingCreditGrantType = /*#__PURE__*/ function(BillingCreditGrantType) {
    BillingCreditGrantType["ROLLOVER"] = "ROLLOVER";
    BillingCreditGrantType["ONBOARDING_REWARD"] = "ONBOARDING_REWARD";
    BillingCreditGrantType["COMPENSATION"] = "COMPENSATION";
    BillingCreditGrantType["SALES"] = "SALES";
    return BillingCreditGrantType;
}({});
(0, _graphql.registerEnumType)(BillingCreditGrantType, {
    name: 'BillingCreditGrantType',
    description: 'The origin of a batch of credits granted to a workspace'
});
const CAPPED_BILLING_CREDIT_GRANT_TYPES = [
    "ROLLOVER"
];
const ADMIN_GRANTABLE_CREDIT_GRANT_TYPES = [
    "COMPENSATION",
    "SALES"
];

//# sourceMappingURL=billing-credit-grant-type.enum.js.map