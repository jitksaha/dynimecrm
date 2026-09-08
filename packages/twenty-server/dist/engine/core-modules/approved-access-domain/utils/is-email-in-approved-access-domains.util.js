"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isEmailInApprovedAccessDomains", {
    enumerable: true,
    get: function() {
        return isEmailInApprovedAccessDomains;
    }
});
const _getdomainfromemail = require("../../../../utils/get-domain-from-email");
const isEmailInApprovedAccessDomains = ({ email, approvedAccessDomains, isEmailVerificationRequired })=>{
    if (!isEmailVerificationRequired) {
        return false;
    }
    const emailDomain = (0, _getdomainfromemail.getDomainFromEmail)(email);
    return approvedAccessDomains.some((approvedAccessDomain)=>approvedAccessDomain.isValidated && approvedAccessDomain.domain === emailDomain);
};

//# sourceMappingURL=is-email-in-approved-access-domains.util.js.map