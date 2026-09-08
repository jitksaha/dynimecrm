"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDomainNamesFromLinks", {
    enumerable: true,
    get: function() {
        return getDomainNamesFromLinks;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _parseadditionalitemsutil = require("../../../engine/api/graphql/graphql-query-runner/utils/parse-additional-items.util");
const getDomainNamesFromLinks = (domainName)=>{
    if (!(0, _utils.isDefined)(domainName)) {
        return [];
    }
    return [
        domainName.primaryLinkUrl,
        ...(0, _parseadditionalitemsutil.parseArrayOrJsonStringToArray)(domainName.secondaryLinks).map((link)=>link.url)
    ].filter(_guards.isNonEmptyString);
};

//# sourceMappingURL=get-domain-names-from-links.util.js.map