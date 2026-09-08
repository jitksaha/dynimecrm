"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapResendDomainStatus", {
    enumerable: true,
    get: function() {
        return mapResendDomainStatus;
    }
});
const _emailingdomainstatustype = require("../../types/emailing-domain-status.type");
const mapResendDomainStatus = (status)=>{
    switch(status){
        case 'verified':
            return _emailingdomainstatustype.EmailingDomainStatus.VERIFIED;
        case 'failure':
        case 'failed':
            return _emailingdomainstatustype.EmailingDomainStatus.FAILED;
        case 'temporary_failure':
            return _emailingdomainstatustype.EmailingDomainStatus.TEMPORARY_FAILURE;
        default:
            return _emailingdomainstatustype.EmailingDomainStatus.PENDING;
    }
};

//# sourceMappingURL=map-resend-domain-status.util.js.map