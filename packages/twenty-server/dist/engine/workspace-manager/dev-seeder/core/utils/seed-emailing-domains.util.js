"use strict";
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
    get getSeededEmailGroupDomains () {
        return getSeededEmailGroupDomains;
    },
    get seedEmailingDomains () {
        return seedEmailingDomains;
    }
});
const _emailingdomainstatustype = require("../../../../core-modules/emailing-domain/drivers/types/emailing-domain-status.type");
const _emailingdomaintenantstatustype = require("../../../../core-modules/emailing-domain/drivers/types/emailing-domain-tenant-status.type");
const tableName = 'emailingDomain';
const DEV_EMAILING_DOMAIN = 'dev.twenty.local';
const getSeededEmailGroupDomains = (workspaceId)=>{
    const prefix = workspaceId.slice(0, 8);
    return {
        verified: `${prefix}.${DEV_EMAILING_DOMAIN}`,
        pending: `${prefix}.pending.${DEV_EMAILING_DOMAIN}`
    };
};
const seedEmailingDomains = async ({ queryRunner, schemaName, workspaceId })=>{
    const { verified, pending } = getSeededEmailGroupDomains(workspaceId);
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.${tableName}`, [
        'workspaceId',
        'domain',
        'status',
        'verificationRecords',
        'verifiedAt',
        'tenantStatus'
    ]).orIgnore().values([
        {
            workspaceId,
            domain: verified,
            status: _emailingdomainstatustype.EmailingDomainStatus.VERIFIED,
            verificationRecords: [],
            verifiedAt: new Date(),
            tenantStatus: _emailingdomaintenantstatustype.EmailingDomainTenantStatus.ACTIVE
        },
        {
            workspaceId,
            domain: pending,
            status: _emailingdomainstatustype.EmailingDomainStatus.PENDING,
            verificationRecords: [
                {
                    type: 'TXT',
                    key: `_amazonses.${pending}`,
                    value: 'seed-verification-token'
                },
                {
                    type: 'CNAME',
                    key: `seed1._domainkey.${pending}`,
                    value: 'seed1.dkim.amazonses.com'
                }
            ],
            verifiedAt: null,
            tenantStatus: _emailingdomaintenantstatustype.EmailingDomainTenantStatus.ACTIVE
        }
    ]).execute();
};

//# sourceMappingURL=seed-emailing-domains.util.js.map