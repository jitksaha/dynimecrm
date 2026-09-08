"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _isemailinapprovedaccessdomainsutil = require("../is-email-in-approved-access-domains.util");
describe('isEmailInApprovedAccessDomains', ()=>{
    const approvedAccessDomains = [
        {
            domain: 'twenty.com',
            isValidated: true
        }
    ];
    it('should deny when email verification is not required, even on a validated domain', ()=>{
        expect((0, _isemailinapprovedaccessdomainsutil.isEmailInApprovedAccessDomains)({
            email: 'tata@twenty.com',
            approvedAccessDomains,
            isEmailVerificationRequired: false
        })).toBe(false);
    });
    it('should grant a matching validated domain when email verification is required', ()=>{
        expect((0, _isemailinapprovedaccessdomainsutil.isEmailInApprovedAccessDomains)({
            email: 'tata@twenty.com',
            approvedAccessDomains,
            isEmailVerificationRequired: true
        })).toBe(true);
    });
    it('should deny when the matching domain is not validated', ()=>{
        expect((0, _isemailinapprovedaccessdomainsutil.isEmailInApprovedAccessDomains)({
            email: 'tata@twenty.com',
            approvedAccessDomains: [
                {
                    domain: 'twenty.com',
                    isValidated: false
                }
            ],
            isEmailVerificationRequired: true
        })).toBe(false);
    });
    it('should deny when the email domain does not match any approved domain', ()=>{
        expect((0, _isemailinapprovedaccessdomainsutil.isEmailInApprovedAccessDomains)({
            email: 'tata@evil.com',
            approvedAccessDomains,
            isEmailVerificationRequired: true
        })).toBe(false);
    });
});

//# sourceMappingURL=is-email-in-approved-access-domains.util.spec.js.map