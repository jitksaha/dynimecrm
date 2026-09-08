"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "mapResendDomainRecords", {
    enumerable: true,
    get: function() {
        return mapResendDomainRecords;
    }
});
const _utils = require("twenty-shared/utils");
const mapResendRecordStatus = (status)=>{
    switch(status){
        case 'verified':
            return 'success';
        case 'failure':
        case 'failed':
            return 'error';
        default:
            return 'pending';
    }
};
const isVerificationRecordType = (type)=>{
    return type === 'TXT' || type === 'CNAME' || type === 'MX';
};
const mapResendDomainRecords = (records)=>{
    return (records ?? []).filter((record)=>isVerificationRecordType(record.type)).map((record)=>({
            type: record.type,
            key: record.name,
            value: record.value,
            ...(0, _utils.isDefined)(record.priority) ? {
                priority: record.priority
            } : {},
            status: mapResendRecordStatus(record.status)
        }));
};

//# sourceMappingURL=map-resend-domain-records.util.js.map