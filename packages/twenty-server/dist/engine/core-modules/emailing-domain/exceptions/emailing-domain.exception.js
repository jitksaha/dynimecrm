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
    get EmailingDomainException () {
        return EmailingDomainException;
    },
    get EmailingDomainExceptionCode () {
        return EmailingDomainExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var EmailingDomainExceptionCode = /*#__PURE__*/ function(EmailingDomainExceptionCode) {
    EmailingDomainExceptionCode["EMAILING_DOMAIN_ALREADY_REGISTERED"] = "EMAILING_DOMAIN_ALREADY_REGISTERED";
    EmailingDomainExceptionCode["EMAILING_DOMAIN_NOT_VERIFIED"] = "EMAILING_DOMAIN_NOT_VERIFIED";
    EmailingDomainExceptionCode["EMAILING_DOMAIN_UNSUBSCRIBE_NOT_READY"] = "EMAILING_DOMAIN_UNSUBSCRIBE_NOT_READY";
    EmailingDomainExceptionCode["MESSAGE_SUPPRESSION_NOT_FOUND"] = "MESSAGE_SUPPRESSION_NOT_FOUND";
    EmailingDomainExceptionCode["MESSAGE_SUPPRESSION_NOT_REMOVABLE"] = "MESSAGE_SUPPRESSION_NOT_REMOVABLE";
    EmailingDomainExceptionCode["MESSAGE_CAMPAIGN_NOT_FOUND"] = "MESSAGE_CAMPAIGN_NOT_FOUND";
    EmailingDomainExceptionCode["MESSAGE_CAMPAIGN_NOT_SENDABLE"] = "MESSAGE_CAMPAIGN_NOT_SENDABLE";
    EmailingDomainExceptionCode["MESSAGE_CAMPAIGN_INSUFFICIENT_CREDITS"] = "MESSAGE_CAMPAIGN_INSUFFICIENT_CREDITS";
    EmailingDomainExceptionCode["MESSAGE_CAMPAIGN_NOT_CANCELABLE"] = "MESSAGE_CAMPAIGN_NOT_CANCELABLE";
    return EmailingDomainExceptionCode;
}({});
const getEmailingDomainExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "EMAILING_DOMAIN_ALREADY_REGISTERED":
            return /*i18n*/ {
                id: "s6batt",
                message: "This domain is already registered."
            };
        case "EMAILING_DOMAIN_NOT_VERIFIED":
            return /*i18n*/ {
                id: "r+kse7",
                message: "No verified sending domain matches this from address."
            };
        case "EMAILING_DOMAIN_UNSUBSCRIBE_NOT_READY":
            return /*i18n*/ {
                id: "6lmi/1",
                message: "Marketing sending is on hold until the unsubscribe domain is verified."
            };
        case "MESSAGE_SUPPRESSION_NOT_FOUND":
            return /*i18n*/ {
                id: "dZF5Gw",
                message: "This suppressed address no longer exists."
            };
        case "MESSAGE_SUPPRESSION_NOT_REMOVABLE":
            return /*i18n*/ {
                id: "4CW4iW",
                message: "This address cannot be removed from the suppression list."
            };
        case "MESSAGE_CAMPAIGN_NOT_FOUND":
            return /*i18n*/ {
                id: "ZyEq3L",
                message: "This campaign no longer exists."
            };
        case "MESSAGE_CAMPAIGN_INSUFFICIENT_CREDITS":
            return /*i18n*/ {
                id: "F0NM9B",
                message: "This campaign needs more email credits than your workspace has left. Top up your credits or send to a smaller list."
            };
        case "MESSAGE_CAMPAIGN_NOT_SENDABLE":
            return /*i18n*/ {
                id: "SRnMG0",
                message: "This campaign cannot be sent. It may be missing a sender, subject or recipient list, or it was already sent."
            };
        case "MESSAGE_CAMPAIGN_NOT_CANCELABLE":
            return /*i18n*/ {
                id: "EkozT1",
                message: "Only a campaign that is currently sending can be canceled."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let EmailingDomainException = class EmailingDomainException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getEmailingDomainExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=emailing-domain.exception.js.map