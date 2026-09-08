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
    get WebhookSubscriptionDriverException () {
        return WebhookSubscriptionDriverException;
    },
    get WebhookSubscriptionDriverExceptionCode () {
        return WebhookSubscriptionDriverExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../../utils/custom-exception");
var WebhookSubscriptionDriverExceptionCode = /*#__PURE__*/ function(WebhookSubscriptionDriverExceptionCode) {
    WebhookSubscriptionDriverExceptionCode["PROVIDER_NOT_CONFIGURED"] = "PROVIDER_NOT_CONFIGURED";
    WebhookSubscriptionDriverExceptionCode["PROVIDER_RESPONSE_INVALID"] = "PROVIDER_RESPONSE_INVALID";
    WebhookSubscriptionDriverExceptionCode["UNSUPPORTED_PROVIDER"] = "UNSUPPORTED_PROVIDER";
    WebhookSubscriptionDriverExceptionCode["NOT_FOUND"] = "NOT_FOUND";
    WebhookSubscriptionDriverExceptionCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    WebhookSubscriptionDriverExceptionCode["TEMPORARY_ERROR"] = "TEMPORARY_ERROR";
    WebhookSubscriptionDriverExceptionCode["UNKNOWN"] = "UNKNOWN";
    return WebhookSubscriptionDriverExceptionCode;
}({});
const getWebhookSubscriptionDriverExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "NOT_FOUND":
            return /*i18n*/ {
                id: "Dvwk3g",
                message: "The subscription is no longer available on the provider."
            };
        case "INSUFFICIENT_PERMISSIONS":
            return /*i18n*/ {
                id: "cjqhZq",
                message: "The provider denied access to this account. Please reconnect it."
            };
        case "TEMPORARY_ERROR":
            return /*i18n*/ {
                id: "XX3Gdh",
                message: "The provider is temporarily unavailable. Please try again later."
            };
        case "PROVIDER_NOT_CONFIGURED":
        case "PROVIDER_RESPONSE_INVALID":
        case "UNSUPPORTED_PROVIDER":
        case "UNKNOWN":
            return /*i18n*/ {
                id: "s+mvdF",
                message: "The webhook subscription could not be managed for this account."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let WebhookSubscriptionDriverException = class WebhookSubscriptionDriverException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage, cause } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getWebhookSubscriptionDriverExceptionUserFriendlyMessage(code)
        });
        if ((0, _utils.isDefined)(cause)) {
            this.cause = cause;
        }
    }
};

//# sourceMappingURL=webhook-subscription-driver.exception.js.map