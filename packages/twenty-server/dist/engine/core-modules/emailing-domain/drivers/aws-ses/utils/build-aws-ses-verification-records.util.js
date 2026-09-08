"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildAwsSesVerificationRecords", {
    enumerable: true,
    get: function() {
        return buildAwsSesVerificationRecords;
    }
});
const _awssesmailfromsubdomainconstant = require("../constants/aws-ses-mail-from-subdomain.constant");
const MAIL_FROM_MX_PRIORITY = 10;
const MAIL_FROM_SPF_VALUE = 'v=spf1 include:amazonses.com ~all';
const buildAwsSesVerificationRecords = ({ domain, dkimTokens, region })=>{
    const mailFromDomain = `${_awssesmailfromsubdomainconstant.AWS_SES_MAIL_FROM_SUBDOMAIN}.${domain}`;
    const dkimRecords = dkimTokens.map((token)=>({
            type: 'CNAME',
            key: `${token}._domainkey.${domain}`,
            value: `${token}.dkim.amazonses.com`
        }));
    return [
        ...dkimRecords,
        {
            type: 'MX',
            key: mailFromDomain,
            value: `feedback-smtp.${region}.amazonses.com`,
            priority: MAIL_FROM_MX_PRIORITY
        },
        {
            type: 'TXT',
            key: mailFromDomain,
            value: MAIL_FROM_SPF_VALUE
        }
    ];
};

//# sourceMappingURL=build-aws-ses-verification-records.util.js.map