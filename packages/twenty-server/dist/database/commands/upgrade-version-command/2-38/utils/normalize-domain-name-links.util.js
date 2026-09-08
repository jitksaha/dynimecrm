"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeDomainNameLinks", {
    enumerable: true,
    get: function() {
        return normalizeDomainNameLinks;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _parseadditionalitemsutil = require("../../../../../engine/api/graphql/graphql-query-runner/utils/parse-additional-items.util");
const normalizeStoredDomain = (url)=>(0, _guards.isNonEmptyString)(url) ? (0, _utils.normalizeDomain)(url) : url;
const normalizeDomainNameLinks = (domainName)=>{
    const secondaryLinks = (0, _parseadditionalitemsutil.parseArrayOrJsonStringToArray)(domainName.secondaryLinks);
    const normalizedPrimaryLinkUrl = normalizeStoredDomain(domainName.primaryLinkUrl);
    const normalizedSecondaryLinks = secondaryLinks.map((link)=>({
            ...link,
            url: normalizeStoredDomain(link.url)
        }));
    const changed = normalizedPrimaryLinkUrl !== domainName.primaryLinkUrl || normalizedSecondaryLinks.some((link, index)=>link.url !== secondaryLinks[index].url);
    return {
        changed,
        value: {
            ...domainName,
            primaryLinkUrl: normalizedPrimaryLinkUrl,
            secondaryLinks: normalizedSecondaryLinks.length > 0 ? normalizedSecondaryLinks : domainName.secondaryLinks
        }
    };
};

//# sourceMappingURL=normalize-domain-name-links.util.js.map