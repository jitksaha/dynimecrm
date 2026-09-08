"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapResendSendingStatus", {
    enumerable: true,
    get: function() {
        return mapResendSendingStatus;
    }
});
const _utils = require("twenty-shared/utils");
const _mapresenddomainstatusutil = require("./map-resend-domain-status.util");
const _emailingdomainstatustype = require("../../types/emailing-domain-status.type");
const SENDING_RECORD_LABELS = [
    'SPF',
    'DKIM'
];
const mapResendSendingStatus = (domain)=>{
    if (domain.status === 'verified') {
        return _emailingdomainstatustype.EmailingDomainStatus.VERIFIED;
    }
    const sendingRecords = (domain.records ?? []).filter((record)=>SENDING_RECORD_LABELS.includes(record.record.toUpperCase()));
    if (!(0, _utils.isNonEmptyArray)(sendingRecords)) {
        return (0, _mapresenddomainstatusutil.mapResendDomainStatus)(domain.status);
    }
    if (sendingRecords.every((record)=>record.status === 'verified')) {
        return _emailingdomainstatustype.EmailingDomainStatus.VERIFIED;
    }
    if (sendingRecords.some((record)=>record.status === 'failure' || record.status === 'failed')) {
        return _emailingdomainstatustype.EmailingDomainStatus.FAILED;
    }
    if (sendingRecords.some((record)=>record.status === 'temporary_failure')) {
        return _emailingdomainstatustype.EmailingDomainStatus.TEMPORARY_FAILURE;
    }
    return _emailingdomainstatustype.EmailingDomainStatus.PENDING;
};

//# sourceMappingURL=map-resend-sending-status.util.js.map