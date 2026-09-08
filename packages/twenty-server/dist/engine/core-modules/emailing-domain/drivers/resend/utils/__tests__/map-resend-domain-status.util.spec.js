"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mapresenddomainstatusutil = require("../map-resend-domain-status.util");
const _emailingdomainstatustype = require("../../../types/emailing-domain-status.type");
describe('mapResendDomainStatus', ()=>{
    it('should map provider statuses to emailing domain statuses', ()=>{
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)('verified')).toBe(_emailingdomainstatustype.EmailingDomainStatus.VERIFIED);
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)('failure')).toBe(_emailingdomainstatustype.EmailingDomainStatus.FAILED);
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)('failed')).toBe(_emailingdomainstatustype.EmailingDomainStatus.FAILED);
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)('temporary_failure')).toBe(_emailingdomainstatustype.EmailingDomainStatus.TEMPORARY_FAILURE);
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)('not_started')).toBe(_emailingdomainstatustype.EmailingDomainStatus.PENDING);
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)('pending')).toBe(_emailingdomainstatustype.EmailingDomainStatus.PENDING);
        expect((0, _mapresenddomainstatusutil.mapResendDomainStatus)(undefined)).toBe(_emailingdomainstatustype.EmailingDomainStatus.PENDING);
    });
});

//# sourceMappingURL=map-resend-domain-status.util.spec.js.map