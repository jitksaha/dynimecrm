"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "partitionCompanyDomainNameRewrites", {
    enumerable: true,
    get: function() {
        return partitionCompanyDomainNameRewrites;
    }
});
const partitionCompanyDomainNameRewrites = ({ rewrites, claimedPrimaryLinkUrls })=>{
    const updates = [];
    const skippedCompanyIds = [];
    for (const { id, currentPrimaryLinkUrl, domainName } of rewrites){
        const isPrimaryLinkUrlRewritten = domainName.primaryLinkUrl !== currentPrimaryLinkUrl;
        if (isPrimaryLinkUrlRewritten) {
            if (claimedPrimaryLinkUrls.has(domainName.primaryLinkUrl)) {
                skippedCompanyIds.push(id);
                continue;
            }
            claimedPrimaryLinkUrls.add(domainName.primaryLinkUrl);
        }
        updates.push({
            id,
            domainName
        });
    }
    return {
        updates,
        skippedCompanyIds
    };
};

//# sourceMappingURL=partition-company-domain-name-rewrites.util.js.map