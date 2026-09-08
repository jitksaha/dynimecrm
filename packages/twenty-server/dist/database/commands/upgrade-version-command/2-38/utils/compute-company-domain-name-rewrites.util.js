"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeCompanyDomainNameRewrites", {
    enumerable: true,
    get: function() {
        return computeCompanyDomainNameRewrites;
    }
});
const _normalizedomainnamelinksutil = require("./normalize-domain-name-links.util");
const computeCompanyDomainNameRewrites = (candidates)=>{
    const rewrites = [];
    for (const { id, domainName } of candidates){
        const { changed, value } = (0, _normalizedomainnamelinksutil.normalizeDomainNameLinks)(domainName);
        if (changed) {
            rewrites.push({
                id,
                currentPrimaryLinkUrl: domainName.primaryLinkUrl,
                domainName: value
            });
        }
    }
    return rewrites;
};

//# sourceMappingURL=compute-company-domain-name-rewrites.util.js.map