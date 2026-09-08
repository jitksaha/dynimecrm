"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isEmailBlocklisted", {
    enumerable: true,
    get: function() {
        return isEmailBlocklisted;
    }
});
const _getdomainfromemail = require("../../../utils/get-domain-from-email");
const isEmailBlocklisted = (channelHandle, email, blocklist)=>{
    if (!email || channelHandle.includes(email)) {
        return false;
    }
    const domain = (0, _getdomainfromemail.getDomainFromEmail)(email);
    return blocklist.some((item)=>{
        if (item.startsWith('@')) {
            const bareDomain = item.slice(1);
            return domain === bareDomain || (domain?.endsWith(`.${bareDomain}`) ?? false);
        }
        return email === item;
    });
};

//# sourceMappingURL=is-email-blocklisted.util.js.map