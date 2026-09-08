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
    get isWorkDomain () {
        return isWorkDomain;
    },
    get isWorkEmail () {
        return isWorkEmail;
    }
});
const _guards = require("@sniptt/guards");
const _emailproviders = require("./email-providers");
const _getdomainfromemail = require("./get-domain-from-email");
const isWorkEmail = (email)=>{
    const domain = (0, _getdomainfromemail.getDomainFromEmail)(email);
    return (0, _guards.isNonEmptyString)(domain) && !_emailproviders.emailProvidersSet.has(domain);
};
const isWorkDomain = (domain)=>{
    return !_emailproviders.emailProvidersSet.has(domain);
};

//# sourceMappingURL=is-work-email.js.map