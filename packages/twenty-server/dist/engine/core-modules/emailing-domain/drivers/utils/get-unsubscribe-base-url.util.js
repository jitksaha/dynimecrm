"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getUnsubscribeBaseUrl", {
    enumerable: true,
    get: function() {
        return getUnsubscribeBaseUrl;
    }
});
const _guards = require("@sniptt/guards");
const _emailingdomaindriverexception = require("../exceptions/emailing-domain-driver.exception");
const _unsubscribehostnamestatustype = require("../types/unsubscribe-hostname-status.type");
const getUnsubscribeBaseUrl = (emailingDomain)=>{
    if (emailingDomain.unsubscribeHostnameStatus !== _unsubscribehostnamestatustype.UnsubscribeHostnameStatus.ACTIVE || !(0, _guards.isNonEmptyString)(emailingDomain.unsubscribeHostname)) {
        throw new _emailingdomaindriverexception.EmailingDomainDriverException(`Cannot send email for ${emailingDomain.domain}: unsubscribe domain is not active (status: ${emailingDomain.unsubscribeHostnameStatus})`, _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNSUBSCRIBE_NOT_READY);
    }
    return `https://${emailingDomain.unsubscribeHostname}`;
};

//# sourceMappingURL=get-unsubscribe-base-url.util.js.map